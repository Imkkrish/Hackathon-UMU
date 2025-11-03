#ml_ocr_service.py
import os
import certifi
import faiss
import numpy as np
import pandas as pd
import sqlite3

os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['SSL_CERT_FILE'] = certifi.where()
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract
import io
import re, string
import uvicorn
# Configure Tesseract path for Windows
if os.name == "nt":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

DB_FILE = "pincodes.db"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
FAISS_FILE = "pincode_faiss.index"

app = FastAPI(title="AI Delivery Mapper - OCR + Matching", version="3.0")


def normalize_text(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[\W_]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


print(" Loading dataset and FAISS index...")

conn = sqlite3.connect(DB_FILE)
df = pd.read_sql("SELECT officename, district, state, pincode FROM pincodes", conn)
conn.close()
df["text"] = df[["officename", "district", "state", "pincode"]].astype(str).agg(" ".join, axis=1)
df["text_norm"] = df["text"].apply(normalize_text)

model = SentenceTransformer(MODEL_NAME)

index = faiss.read_index(FAISS_FILE)
meta = np.load(FAISS_FILE + ".meta.npy", allow_pickle=True)

print(f" Model and FAISS index loaded ({len(meta)} records).")


@app.post("/ocr")
async def ocr_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image, lang="eng")
        clean_text = normalize_text(text)
        return {"raw_text": text, "clean_text": clean_text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

class MatchRequest(BaseModel):
    text: str
    top_k: int = 5

@app.post("/match")
def match_address(req: MatchRequest):
    query = normalize_text(req.text)
    emb = model.encode([query], convert_to_numpy=True)
    faiss.normalize_L2(emb)
    D, I = index.search(emb, req.top_k)
    results = []
    for idx, score in zip(I[0], D[0]):
        if idx == -1: continue
        office, district, state, pin = meta[idx]
        results.append({
            "officename": str(office),
            "district": str(district),
            "state": str(state),
            "pincode": str(pin),
            "confidence": round(float(score), 4)
        })
    return {"query": req.text, "normalized": query, "matches": results}


@app.post("/ocr_match")
async def ocr_then_match(file: UploadFile = File(...)):
    """Runs OCR first, then matches extracted text."""
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image, lang="eng")
    clean_text = normalize_text(text)
    emb = model.encode([clean_text], convert_to_numpy=True)
    faiss.normalize_L2(emb)
    D, I = index.search(emb, 5)
    results = []
    for idx, score in zip(I[0], D[0]):
        if idx == -1: continue
        office, district, state, pin = meta[idx]
        results.append({
            "officename": str(office),
            "district": str(district),
            "state": str(state),
            "pincode": str(pin),
            "confidence": round(float(score), 4)
        })
    return {"raw_text": text, "normalized": clean_text, "matches": results}

@app.get("/")
def root():
    return {"status": "ok", "records": len(meta)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)

#curl -X POST "http://127.0.0.1:8003/ocr_match" \
#  -H "accept: application/json" \
# -H "Content-Type: multipart/form-data" \
#  -F "file=@sample_parcel.jpg"
