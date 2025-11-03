from utils import clean_text
import re
COMMON = {"Dlii":"Delhi","Gurgoan":"Gurgaon","Vasant Kuunj":"Vasant Kunj"}
def parse_address(raw):
    s = clean_text(raw)
    for k,v in COMMON.items():
        s = s.replace(k.title(), v)
    m = re.search(r"\b(\d{6})\b", s)
    return {"raw": raw, "cleaned": s, "pincode": m.group(1) if m else None}
