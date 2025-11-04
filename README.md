  --build-arg VITE_GOOGLE_CLIENT_ID=372975400843-ffr7c5j59nmga7tk2nbog6o5mjpgq11s.apps.googleusercontent.com \
  --build-arg VITE_API_BASE_URL=http://localhost:3001 \
  -t india-post-frontend .
docker run -p 5173:80 india-post-frontend

AI-Powered Delivery Post Office Identification System

Department of Posts, Government of India | India Post Hackathon 2025

## Project Overview

This project delivers an intelligent, AI-powered system for identifying the correct delivery post office for mail items with unclear or mismatched addresses. The solution leverages geospatial infrastructure (DIGIPIN), machine learning, and a comprehensive PIN code dataset to automate address correction, improve operational efficiency, and enhance customer satisfaction for India Post.

## Problem Statement

India Post operates over 165,000 post offices serving more than 19,000 PIN codes. Approximately 5% of daily mail articles contain incorrect or mismatched PIN codes, resulting in misrouted mail, delivery delays, increased operational costs, and customer dissatisfaction. The challenge is to automate the identification and correction of delivery addresses using advanced AI and geospatial technologies.

## Solution Summary

The system consists of four main components:

1. **Frontend Web Application**: Modern React-based UI for address input, batch processing, and visualization.
2. **Backend API**: Node.js/Express service for orchestrating address matching, PIN code lookups, and batch operations.
3. **ML Microservice**: Python/FastAPI service for AI-powered address normalization, matching, and OCR extraction.
4. **DIGIPIN API**: Node.js service for geospatial encoding and decoding of addresses.

## Architecture

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Frontend   │ → │  Backend    │ → │  ML Service │ → │  DIGIPIN    │
│  (React)    │   │  (Express)  │   │  (FastAPI)  │   │  (Node.js)  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

## Key Features

- Secure authentication via Google OAuth 2.0
- AI-powered address matching using sentence-transformer embeddings and FAISS similarity search
- Bulk address correction via CSV upload and batch processing
- Interactive map and 3D visualization of delivery locations
- Real-time analytics dashboard for operational insights

## Technology Stack

**Frontend:** React 19, Vite 7, Tailwind CSS v4, React Router v7, Google OAuth 2.0
**Backend:** Node.js 18+, Express, csv-parser, axios
**ML Service:** Python 3.9+/3.11+, FastAPI, sentence-transformers (MiniLM-L6), FAISS, Tesseract OCR/EasyOCR
**Data:** All India PIN Code Directory 2025 (165,629+ records), DIGIPIN geospatial encoding

## Setup and Installation

### Prerequisites
- Node.js 18 or higher
- Python 3.9 or higher (for ML service)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackathon
   ```
2. **Run setup script**
   ```bash
   ./setup.sh
   ```
3. **Configure environment variables**
   - Edit `frontend/.env.local` for frontend settings
   - Edit `.env` files in backend/ml/digipin as required
4. **Start services**
   - Frontend: `cd frontend && npm run dev`
   - Backend: `cd backend && npm start`
   - ML Service: `cd ml && python main.py`
   - DIGIPIN API: `cd digipin && npm start`
5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - ML API: http://localhost:8000
   - DIGIPIN API: http://localhost:5000

## Usage

### Single Address Matching
- Enter address text or upload parcel image
- System extracts, normalizes, and matches to the correct delivery office
- Results include top matches, confidence scores, and map visualization

### Batch Processing
- Upload CSV file with multiple addresses
- System processes in batches, provides downloadable results with corrections and analytics

### Visualization
- Interactive map displays delivery office locations
- 3D visualization shows parcel routing and confidence levels

## Security Practices

- Google OAuth Client ID is public and safe to include in frontend code
- Client Secret is stored securely in the `secrets/` folder (never committed to version control)
- Environment variables are managed via `.env` files (gitignored)
- Protected routes require authentication; session tokens are stored securely
- Secrets folder is excluded from Docker builds

## Testing

### Frontend
```bash
cd frontend
npm run lint
```
### Backend
```bash
cd backend
npm test
```
### ML Service
```bash
cd ml
pytest
```

## Performance Targets

- Single address match: <500ms
- OCR extraction: <2s per image
- Batch processing: <5 minutes for 1000 addresses
- Frontend load time: <3s
- ML matching accuracy: >95%

## Roadmap

**Phase 1: Core MVP**
- Frontend with Google OAuth and protected routes
- Backend API for address matching and PIN code lookups
- ML matching service

**Phase 2: Enhanced Features**
- OCR integration
- 3D visualization
- Real-time suggestions and explainable AI

**Phase 3: Production Ready**
- Performance optimization
- Comprehensive testing
- Production deployment
- Monitoring and logging

## Project Structure

```
Hackathon/
├── frontend/    # React frontend
├── backend/     # Node.js backend
├── ml/          # Python ML service
├── digipin/     # DIGIPIN API
├── post/        # Data assets
├── secrets/     # OAuth credentials (gitignored)
├── context.md   # System documentation
├── setup.sh     # Setup script
```

## License

India Post 2025 | Department of Posts, Government of India

## References

- Frontend documentation: `frontend/README.md`
- Backend documentation: `backend/README.md`
- ML service documentation: `ml/README.md`
- DIGIPIN technical documentation: `digipin/docs/DIGIPIN_Technical_Document.md`
- System context: `context.md`

## Support

For questions or issues, please refer to the documentation files above or contact the project team.
