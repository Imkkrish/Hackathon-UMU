#ml_service.py
import os
import certifi
import faiss
import numpy as np
import pandas as pd
import sqlite3
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn
import re, string

# Set SSL certificate path
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['SSL_CERT_FILE'] = certifi.where()

DB_FILE = "pincodes.db"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
FAISS_FILE = "pincode_faiss.index"
BATCH_SIZE = 2048

app = FastAPI(title="AI Delivery Mapper - ML Microservice", version="2.0")


def normalize_text(s: str) -> str:
    """Cleans and normalizes address text."""
    s = s.lower()
    s = re.sub(r"[\W_]+", " ", s)  # remove punctuation
    s = re.sub(r"\s+", " ", s)
    s = s.strip()
    return s


print(" Loading dataset and model...")

conn = sqlite3.connect(DB_FILE)
df = pd.read_sql("SELECT officename, district, state, pincode FROM pincodes", conn)
conn.close()
df["text"] = df[["officename", "district", "state", "pincode"]].astype(str).agg(" ".join, axis=1)
df["text_norm"] = df["text"].apply(normalize_text)

model = SentenceTransformer(MODEL_NAME)


def build_index():
    print(f" Building FAISS index for {len(df)} records...")
    embeddings = model.encode(df["text_norm"].tolist(), batch_size=64, show_progress_bar=True, convert_to_numpy=True)
    # Normalize for cosine similarity
    faiss.normalize_L2(embeddings)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # inner product = cosine similarity
    index.add(embeddings)
    faiss.write_index(index, FAISS_FILE)
    np.save(FAISS_FILE + ".meta.npy", df[["officename", "district", "state", "pincode"]].to_numpy())
    print(f" FAISS index built and saved to {FAISS_FILE}")
    return index

try:
    index = faiss.read_index(FAISS_FILE)
    meta = np.load(FAISS_FILE + ".meta.npy", allow_pickle=True)
    print(" Loaded existing FAISS index.")
except:
    index = build_index()
    meta = np.load(FAISS_FILE + ".meta.npy", allow_pickle=True)

class MatchRequest(BaseModel):
    text: str
    top_k: int = 5

@app.post("/match")
def match_address(req: MatchRequest):
    query = normalize_text(req.text)
    query_vec = model.encode([query], convert_to_numpy=True)
    faiss.normalize_L2(query_vec)

    D, I = index.search(query_vec, req.top_k)
    results = []
    for idx, score in zip(I[0], D[0]):
        if idx == -1:
            continue
        office, district, state, pin = meta[idx]
        results.append({
            "officename": str(office),
            "district": str(district),
            "state": str(state),
            "pincode": str(pin),
            "confidence": round(float(score), 4)
        })
    return {"query": req.text, "normalized": query, "matches": results}

@app.get("/")
def root():
    return {"status": "ok", "records": len(df)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)

#curl -X POST "http://127.0.0.1:8002/match" \
#  -H "Content-Type: application/json" \
#  -d '{"text": "koramangala bangalore 560034"}'
