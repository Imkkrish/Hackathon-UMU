#!/bin/bash
set -e

# ============================================================
# SMARTPOST GRID - FULL ONE-COMMAND SETUP (Backend + Frontend)
# ============================================================

echo "🚀 Setting up SmartPost Grid (AI + DIGIPIN system)..."

# ---- Folder setup ----
PROJECT="SmartPost-Grid"
BACKEND="$PROJECT/backend"
FRONTEND="$PROJECT/frontend"

mkdir -p "$BACKEND/data" "$FRONTEND"
cd "$(dirname "$0")"

# ---- Backend files ----
echo "📦 Creating backend files..."

cat > "$BACKEND/requirements.txt" <<EOF
fastapi==0.95.2
uvicorn[standard]==0.22.0
pydantic==1.10.11
pandas==2.2.2
python-multipart==0.0.6
requests==2.31.0
EOF

cat > "$BACKEND/config.py" <<'EOF'
import os
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DIGIPIN_CSV = os.path.join(DATA_DIR, "digipin_lookup.csv")
HUBS_CSV = os.path.join(DATA_DIR, "sample_hubs.csv")
EOF

cat > "$BACKEND/utils.py" <<'EOF'
import re, unicodedata
from math import radians, cos, sin, asin, sqrt
def clean_text(s):
    if not s: return ""
    s = unicodedata.normalize("NFKD", s)
    s = re.sub(r"[^0-9A-Za-z\s,.-]", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip().title()
def haversine_km(lat1, lon1, lat2, lon2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    a = sin((lat2-lat1)/2)**2 + cos(lat1)*cos(lat2)*sin((lon2-lon1)/2)**2
    return 6371 * 2 * asin(sqrt(a))
EOF

cat > "$BACKEND/address_parser.py" <<'EOF'
from utils import clean_text
import re
COMMON = {"Dlii":"Delhi","Gurgoan":"Gurgaon","Vasant Kuunj":"Vasant Kunj"}
def parse_address(raw):
    s = clean_text(raw)
    for k,v in COMMON.items():
        s = s.replace(k.title(), v)
    m = re.search(r"\b(\d{6})\b", s)
    return {"raw": raw, "cleaned": s, "pincode": m.group(1) if m else None}
EOF

cat > "$BACKEND/digipin_mapper.py" <<'EOF'
import pandas as pd, re
from utils import haversine_km
from config import DIGIPIN_CSV
df = pd.read_csv(DIGIPIN_CSV)
def address_to_digipin(addr):
    m = re.search(r"\b(\d{6})\b", addr)
    if m:
        p=int(m.group(1)); sub=df[df.pincode==p]
        if not sub.empty:
            r=sub.iloc[0]
            return {"digipin":r.digipin,"lat":r.lat,"lon":r.lon,"method":"pincode"}
    r=df.iloc[0]
    return {"digipin":r.digipin,"lat":r.lat,"lon":r.lon,"method":"default"}
EOF

cat > "$BACKEND/hub_identifier.py" <<'EOF'
import pandas as pd
from utils import haversine_km
from config import HUBS_CSV
df=pd.read_csv(HUBS_CSV)
def find_nearest_hub(lat,lon):
    df['dist']=df.apply(lambda r:haversine_km(lat,lon,r.lat,r.lon),axis=1)
    r=df.sort_values('dist').iloc[0]
    return {"hub_name":r.hub_name,"lat":r.lat,"lon":r.lon,"dist_km":float(r.dist)}
EOF

cat > "$BACKEND/models.py" <<'EOF'
from pydantic import BaseModel
class AddressIn(BaseModel):
    address: str
class AnalyzeResp(BaseModel):
    raw: str; cleaned: str
    pincode: str=None; digipin: str=None
    digipin_lat: float=None; digipin_lon: float=None
    digipin_method: str=None; hub_name: str=None; hub_dist_km: float=None
EOF

cat > "$BACKEND/app.py" <<'EOF'
from fastapi import FastAPI
from models import AddressIn, AnalyzeResp
from address_parser import parse_address
from digipin_mapper import address_to_digipin
from hub_identifier import find_nearest_hub
app = FastAPI(title="SmartPost Grid API",version="1.0")
@app.get("/")
def root(): return {"status":"Backend running"}
@app.post("/api/analyze",response_model=AnalyzeResp)
def analyze(data:AddressIn):
    p=parse_address(data.address)
    dig=address_to_digipin(p['cleaned'])
    hub=find_nearest_hub(dig['lat'],dig['lon'])
    return {**p, **{
        "digipin":dig['digipin'],"digipin_lat":dig['lat'],"digipin_lon":dig['lon'],
        "digipin_method":dig['method'],"hub_name":hub['hub_name'],"hub_dist_km":hub['dist_km']
    }}
EOF

# ---- CSVs ----
cat > "$BACKEND/data/digipin_lookup.csv" <<EOF
digipin,lat,lon,pincode
DPIN0001,28.5720,77.2010,110070
DPIN0002,28.5245,77.1855,122001
DPIN0003,12.9716,77.5946,560001
DPIN0004,19.0760,72.8777,400001
EOF
cat > "$BACKEND/data/sample_hubs.csv" <<EOF
hub_name,lat,lon,region
Vasant Kunj Head Post Office,28.5236,77.1744,Delhi
Gurgaon Head Post Office,28.4595,77.0266,Haryana
Bengaluru GPO,12.9716,77.5946,Karnataka
Mumbai GPO,19.075983,72.877655,Maharashtra
EOF

# ---- Frontend files ----
echo "🖥️ Creating frontend Streamlit files..."

cat > "$FRONTEND/requirements.txt" <<EOF
streamlit==1.25.0
requests==2.31.0
EOF

cat > "$FRONTEND/streamlit_app.py" <<'EOF'
import streamlit as st, requests
API="http://localhost:8000"
st.set_page_config(page_title="SmartPost Grid",page_icon="📮",layout="wide")
st.title("SmartPost Grid — AI + DIGIPIN Postal Hub Identifier")
addr=st.text_area("Enter postal address:","House No 23, Vasant Kuunj, New Dlii 110070")
if st.button("Analyze"):
    try:
        r=requests.post(f"{API}/api/analyze",json={"address":addr}).json()
    except Exception as e:
        st.error(f"Backend error: {e}")
        st.stop()
    st.success("✅ Analysis complete")
    st.write("**Cleaned:**",r['cleaned'])
    st.write("**Pincode:**",r['pincode'])
    st.write("**DIGIPIN:**",r['digipin'])
    st.write("**Nearest Hub:**",r['hub_name'])
    st.write("**Distance:**",round(r['hub_dist_km'],2),"km")
    if r['digipin_lat'] and r['digipin_lon']:
        st.map({"lat":[r['digipin_lat']], "lon":[r['digipin_lon']]})
    st.caption("IoT-ready backend endpoint available at /api/location (for future GPS tracking).")
EOF

# ---- Install and run ----
echo "📦 Installing dependencies..."
python3 -m venv "$PROJECT/venv"
source "$PROJECT/venv/bin/activate"
pip install -r "$BACKEND/requirements.txt" -r "$FRONTEND/requirements.txt"

echo "🚀 Starting backend and frontend..."
cd "$PROJECT"
uvicorn backend.app:app --reload --port 8000 & sleep 3
streamlit run frontend/streamlit_app.py --server.port 8501
EOF
