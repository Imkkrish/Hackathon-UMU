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
