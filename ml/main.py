import os
import certifi
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from dotenv import load_dotenv

# Import custom modules
from utils.text_processor import normalize_text, clean_address
from utils.ocr import extract_text_from_image
from models.matcher import AddressMatcher

# Load environment variables
load_dotenv()

# Set SSL certificate path
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['SSL_CERT_FILE'] = certifi.where()

# Configuration
CSV_PATH = os.getenv("CSV_PATH", "../post/all_india_pincode_directory_2025.csv")
PORT = int(os.getenv("ML_PORT", 8000))
HOST = os.getenv("ML_HOST", "0.0.0.0")

# Initialize FastAPI app
app = FastAPI(
    title="AI Delivery Post Office Identification - ML Service",
    description="ML microservice for address matching and OCR extraction (Challenge 1)",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize matcher
matcher = None

@app.on_event("startup")
async def startup_event():
    """Initialize the address matcher on startup"""
    global matcher
    print("🚀 Starting ML Microservice...")
    print(f"📊 Loading dataset from: {CSV_PATH}")
    
    try:
        matcher = AddressMatcher(csv_path=CSV_PATH)
        await matcher.initialize()
        print(f"✅ ML Service ready with {matcher.total_records} post office records")
    except Exception as e:
        print(f"❌ Failed to initialize matcher: {e}")
        raise

# Pydantic models
class NormalizeRequest(BaseModel):
    text: str

class MatchRequest(BaseModel):
    text: str
    top_k: int = 5
    include_digipin: bool = True

class MatchResponse(BaseModel):
    query: str
    normalized_query: str
    matches: List[dict]
    processing_time_ms: float

class OCRResponse(BaseModel):
    raw_text: str
    clean_text: str
    confidence: Optional[float] = None

# API Endpoints

@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "ML Microservice",
        "version": "1.0.0",
        "records_loaded": matcher.total_records if matcher else 0,
        "endpoints": {
            "ocr": "POST /api/ml/ocr",
            "normalize": "POST /api/ml/normalize",
            "match": "POST /api/ml/match"
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    if not matcher or not matcher.is_ready:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    return {
        "status": "healthy",
        "model_loaded": matcher.model is not None,
        "index_loaded": matcher.index is not None,
        "total_records": matcher.total_records
    }

@app.post("/api/ml/ocr", response_model=OCRResponse)
async def ocr_extract(file: UploadFile = File(...)):
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Extract text using OCR
        raw_text, confidence = extract_text_from_image(image_bytes)
        
        # Clean the extracted text
        clean_text = clean_address(raw_text)
        
        return OCRResponse(
            raw_text=raw_text,
            clean_text=clean_text,
            confidence=confidence
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")

@app.post("/api/ml/normalize", response_model=dict)
async def normalize_address(request: NormalizeRequest):
    try:
        normalized = normalize_text(request.text)
        cleaned = clean_address(request.text)
        
        return {
            "original": request.text,
            "normalized": normalized,
            "cleaned": cleaned
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Normalization failed: {str(e)}")

@app.post("/api/ml/match", response_model=MatchResponse)
async def match_address(request: MatchRequest):
    if not matcher or not matcher.is_ready:
        raise HTTPException(status_code=503, detail="Matcher not initialized")
    
    try:
        # Perform matching
        results = await matcher.match(
            query_text=request.text,
            top_k=request.top_k,
            include_digipin=request.include_digipin
        )
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@app.post("/api/ml/ocr_match")
async def ocr_and_match(file: UploadFile = File(...), top_k: int = 5):
    """
    Combined endpoint: Extract text from image and match to post offices
    
    - **file**: Image file containing address
    - **top_k**: Number of matches to return
    - Returns OCR results and matching post offices
    """
    if not matcher or not matcher.is_ready:
        raise HTTPException(status_code=503, detail="Matcher not initialized")
    
    try:
        # Extract text from image
        image_bytes = await file.read()
        raw_text, ocr_confidence = extract_text_from_image(image_bytes)
        clean_text = clean_address(raw_text)
        
        # Match the extracted text
        results = await matcher.match(
            query_text=clean_text,
            top_k=top_k,
            include_digipin=True
        )
        
        # Combine OCR and matching results
        return {
            "ocr": {
                "raw_text": raw_text,
                "clean_text": clean_text,
                "confidence": ocr_confidence
            },
            "matching": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR+Match failed: {str(e)}")

if __name__ == "__main__":
    print(f"🌐 Starting server on {HOST}:{PORT}")
    uvicorn.run(app, host=HOST, port=PORT, log_level="info")
