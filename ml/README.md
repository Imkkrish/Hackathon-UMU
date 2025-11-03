# ML Services Setup

## Requirements

### Python Packages
All Python dependencies can be installed using pip:
```bash
pip install pandas fastapi uvicorn pytesseract python-multipart certifi faiss-cpu sentence-transformers
```

### Tesseract OCR
The OCR service requires Tesseract OCR to be installed on your system:

#### Windows
1. Download the installer from the official Tesseract GitHub releases:
   https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer. The default install location is `C:\Program Files\Tesseract-OCR\`
3. Add Tesseract to your system PATH:
   - Right-click on 'This PC' or 'My Computer'
   - Click 'Properties'
   - Click 'Advanced system settings'
   - Click 'Environment Variables'
   - Under 'System Variables', find and select 'Path'
   - Click 'Edit'
   - Click 'New'
   - Add `C:\Program Files\Tesseract-OCR\` (or your custom install path)
   - Click 'OK' on all windows

Alternatively, if you have Chocolatey package manager installed:
```powershell
choco install tesseract
```

#### Verify Installation
After installing, you can verify Tesseract is working by running:
```powershell
tesseract --version
```

## Services
- `data_service.py` - Pincode database and REST API
- `ml_service.py` - Address matching using FAISS and sentence embeddings
- `ml_ocr_service.py` - OCR and address matching combined service

## Running the Services
Each service can be run using uvicorn:
```bash
uvicorn data_service:app --reload
uvicorn ml_service:app --reload
uvicorn ml_ocr_service:app --reload
```