from pydantic import BaseModel
class AddressIn(BaseModel):
    address: str
class AnalyzeResp(BaseModel):
    raw: str; cleaned: str
    pincode: str=None; digipin: str=None
    digipin_lat: float=None; digipin_lon: float=None
    digipin_method: str=None; hub_name: str=None; hub_dist_km: float=None
