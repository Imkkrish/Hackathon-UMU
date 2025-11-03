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
