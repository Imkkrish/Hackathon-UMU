#data_service.py
import pandas as pd
import sqlite3
import hashlib
from fastapi import FastAPI, HTTPException
from typing import List, Optional
import uvicorn
import re
import os

DATA_FILE = "all_india_pincode_directory_2025.csv"
DB_FILE = "pincodes.db"

app = FastAPI(title="Data Service")


def detect_columns(df: pd.DataFrame):
    cols = [c.strip().lower() for c in df.columns]
    mapping = {}
    def find(keys):
        for key in keys:
            for c in cols:
                if key in c:
                    return c
        return None
    mapping["officename"] = find(["officename","office_name","po_name","branch"])
    mapping["pincode"] = find(["pincode","postalcode","pin"])
    mapping["division"] = find(["division"])
    mapping["district"] = find(["district"])
    mapping["state"] = find(["state"])
    mapping["lat"] = find(["lat","latitude"])
    mapping["lon"] = find(["lon","lng","longitude"])
    print(" Column mapping detected:", mapping)
    return mapping


def load_data_to_sqlite():
    if os.path.exists(DB_FILE):
        print(f" SQLite DB already exists: {DB_FILE}")
        return
    print(f"📂 Loading dataset: {DATA_FILE}")
    df = pd.read_csv(DATA_FILE)
    df.columns = [c.strip().lower() for c in df.columns]
    colmap = detect_columns(df)

    # Select relevant columns and clean
    cols = [v for v in colmap.values() if v]
    df = df[cols].dropna(subset=[colmap["officename"], colmap["pincode"]])
    df = df.rename(columns={
        colmap["officename"]: "officename",
        colmap["pincode"]: "pincode",
        colmap.get("division",""): "division",
        colmap.get("district",""): "district",
        colmap.get("state",""): "state",
        colmap.get("lat",""): "latitude",
        colmap.get("lon",""): "longitude"
    })

    # compute DIGIPIN (8-char hash)
    def make_digipin(row):
        base = f"{row.get('pincode','')}-{row.get('latitude','')}-{row.get('longitude','')}"
        return hashlib.sha1(base.encode()).hexdigest()[:8].upper()
    df["digipin"] = df.apply(make_digipin, axis=1)

    # store in SQLite
    conn = sqlite3.connect(DB_FILE)
    df.to_sql("pincodes", conn, if_exists="replace", index=False)
    conn.close()
    print(f" Saved {len(df)} records to {DB_FILE}")


def query_db(query, params=()):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.on_event("startup")
def startup_event():
    load_data_to_sqlite()


@app.get("/by_pin/{pincode}")
def get_by_pin(pincode: str):
    results = query_db("SELECT * FROM pincodes WHERE pincode = ?", (pincode,))
    if not results:
        raise HTTPException(404, f"No record found for PIN {pincode}")
    return {"count": len(results), "results": results}

@app.get("/by_office")
def get_by_office(name: str):
    name_pattern = f"%{name.lower()}%"
    results = query_db("SELECT * FROM pincodes WHERE LOWER(officename) LIKE ?", (name_pattern,))
    return {"count": len(results), "results": results[:50]}

@app.get("/by_district")
def get_by_district(district: str):
    district_pattern = f"%{district.lower()}%"
    results = query_db("SELECT * FROM pincodes WHERE LOWER(district) LIKE ?", (district_pattern,))
    return {"count": len(results), "results": results[:100]}

@app.get("/random")
def get_random(limit: int = 5):
    results = query_db("SELECT * FROM pincodes ORDER BY RANDOM() LIMIT ?", (limit,))
    return {"count": len(results), "results": results}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)


#curl "http://127.0.0.1:8001/by_pin/110070"
#curl "http://127.0.0.1:8001/by_office?name=Gurgaon"
#curl "http://127.0.0.1:8001/by_district?district=Delhi"
#curl http://127.0.0.1:8001/random
#sqlite3 pincodes.db
#sqlite> .tables
#sqlite> SELECT * FROM pincodes LIMIT 5;
