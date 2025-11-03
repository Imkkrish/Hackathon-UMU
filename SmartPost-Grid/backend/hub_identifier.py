import pandas as pd
from utils import haversine_km
from config import HUBS_CSV
df=pd.read_csv(HUBS_CSV)
def find_nearest_hub(lat,lon):
    df['dist']=df.apply(lambda r:haversine_km(lat,lon,r.lat,r.lon),axis=1)
    r=df.sort_values('dist').iloc[0]
    return {"hub_name":r.hub_name,"lat":r.lat,"lon":r.lon,"dist_km":float(r.dist)}
