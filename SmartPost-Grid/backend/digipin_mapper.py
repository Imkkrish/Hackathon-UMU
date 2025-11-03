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
