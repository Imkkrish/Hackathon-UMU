# 🚀 AI-Powered Delivery Post Office Identification System

**India Post Hackathon 2025** | Department of Posts, Government of India

A comprehensive AI-powered system for identifying correct delivery post offices for mail items with unclear or mismatched addresses, built on the DIGIPIN geospatial infrastructure.

## 📊 Problem Statement

India Post operates 165,000+ post offices across 19,000+ PIN codes. However, approximately **5% of daily mail articles contain incorrect or mismatched PIN codes**, leading to:
- Misrouted mail and delivery delays
- Customer dissatisfaction  
- Operational inefficiencies
- Increased costs from wasteful movement

## 💡 Our Solution

An intelligent system that:
1. **Identifies correct delivery locations** for unclear/mismatched addresses
2. **Automates address correction** using ML-based scanning and matching
3. **Aligns with operational databases** for PIN code clubbing/mapping
4. **Provides visual verification** through maps and 3D visualization
5. **Processes addresses in bulk** via CSV uploads

## 🏗️ System Architecture

```
┌─────────────────┐
│   Frontend      │  React + Vite + Tailwind + Google OAuth
│  (Port 5173)    │  • Home Page
│                 │  • Login/Auth
└────────┬────────┘  • Dashboard
         │           • Address Matching
         │           • Batch Processing
         ▼
┌─────────────────┐
│  Backend API    │  Node.js + Express
│  (Port 3001)    │  • Address matching
│                 │  • CSV processing
└────────┬────────┘  • PIN code lookups
         │
    ┌────┴────┬────────────────┐
    ▼         ▼                ▼
┌─────────┐ ┌──────────┐  ┌──────────┐
│ ML API  │ │ DIGIPIN  │  │  Data    │
│(Pt 8000)│ │(Pt 5000) │  │ (CSV)    │
│         │ │          │  │165K+     │
│Sentence │ │Geo       │  │records   │
│Transformer│ │Encoding │  │          │
└─────────┘ └──────────┘  └──────────┘
```

## 🎯 Key Features

### 🔐 Secure Authentication
- **Google OAuth 2.0** integration for authorized personnel
- Protected routes and session management
- Client-side authentication flow

### 🤖 AI-Powered Matching
- Sentence transformer embeddings (MiniLM-L6)
- FAISS similarity search across 165K+ post offices
- Confidence scoring (0-100%)
- OCR support for parcel images

### 📦 Batch Processing
- Upload CSV with thousands of addresses
- Real-time progress tracking
- Downloadable results with corrections
- Success rate analytics

### 🗺️ Visualization
- Interactive maps showing delivery locations
- DIGIPIN integration for precise geocoding
- Multiple match display with confidence levels

### 📊 Analytics Dashboard
- Real-time statistics
- Processing metrics
- Success rate monitoring
- Recent activity tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+ (for ML service)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Hackathon
   ```

2. **Run setup script:**
   ```bash
   ./setup.sh
   ```

3. **Configure environment:**
   ```bash
   # Edit frontend/.env.local with your settings
   nano frontend/.env.local
   ```

4. **Start services:**
   ```bash
   # Terminal 1: Frontend
   cd frontend && npm run dev
   
   # Terminal 2: Backend (when ready)
   cd backend && npm start
   
   # Terminal 3: ML Service (when ready)
   cd ml && python main.py
   
   # Terminal 4: DIGIPIN API (already exists)
   cd digipin && npm start
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - ML API: http://localhost:8000
   - DIGIPIN API: http://localhost:5000

## 📁 Project Structure

```
Hackathon/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Login, Dashboard, AddressMatch, etc.
│   │   ├── assets/        # Images and logos
│   │   └── App.jsx        # Main app with routing
│   ├── Dockerfile         # Production container
│   └── .env.local         # Local configuration (gitignored)
│
├── backend/               # Node.js backend (to build)
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
│
├── ml/                   # Python ML service (to build)
│   ├── models/          # AI models
│   ├── utils/           # OCR, text processing
│   └── main.py          # FastAPI server
│
├── digipin/             # DIGIPIN API (existing)
│   ├── src/            # Core DIGIPIN logic
│   └── docs/           # Technical documentation
│
├── post/                # Data assets
│   └── all_india_pincode_directory_2025.csv
│
├── secrets/             # OAuth credentials (gitignored)
│   └── client_secret_*.json
│
├── context.md           # Detailed system documentation
├── SECURITY.md          # Security guidelines
└── setup.sh            # Setup automation script
```

## 🔐 Security

### Google OAuth Configuration

**Client ID (PUBLIC):** `372975400843-ffr7c5j59nmga7tk2nbog6o5mjpgq11s.apps.googleusercontent.com`

This Client ID is **safe to share** and is included in the frontend code.

**Client Secret (PRIVATE):** Stored in `secrets/` folder (gitignored)

⚠️ **Important:** The client secret should **NEVER** be committed to version control or included in frontend code.

### What's Protected

- ✅ Client Secret never exposed
- ✅ Environment variables in `.env.local` (gitignored)
- ✅ Secrets folder excluded from Docker builds
- ✅ Protected routes require authentication
- ✅ Session tokens stored securely

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

## 🐳 Docker Deployment

### Frontend

```bash
cd frontend
docker build \
  --build-arg VITE_GOOGLE_CLIENT_ID=372975400843-ffr7c5j59nmga7tk2nbog6o5mjpgq11s.apps.googleusercontent.com \
  --build-arg VITE_API_BASE_URL=http://localhost:3001 \
  -t india-post-frontend .

docker run -p 5173:80 india-post-frontend
```

### Full Stack (with docker-compose)

```bash
docker-compose up -d
```

## 📚 Documentation

- [Frontend README](frontend/README.md) - Frontend setup and features
- [SECURITY.md](SECURITY.md) - Security best practices
- [context.md](context.md) - Comprehensive system documentation
- [DIGIPIN Technical Docs](digipin/docs/DIGIPIN_Technical_Document.md)

## 🎨 Pages & Features

### Public Pages
- **Home (/)** - Landing page with product overview
- **Login (/login)** - Google OAuth sign-in

### Protected Pages (Requires Authentication)
- **Dashboard (/dashboard)** - Main control panel with stats
- **Address Match (/address-match)** - Single address correction
- **Batch Process (/batch-process)** - Bulk CSV processing

## 🛠️ Technology Stack

### Frontend
- React 19 with Vite 7
- Tailwind CSS v4
- React Router v7
- Google OAuth 2.0

### Backend (To Build)
- Node.js 18+ with Express
- CSV Parser
- Axios for API calls

### ML Service (To Build)
- Python 3.9+ with FastAPI
- sentence-transformers (MiniLM-L6)
- FAISS for similarity search
- Tesseract OCR / EasyOCR

### Data
- All India PIN Code Directory 2025
- 165,629+ post office records
- DIGIPIN geospatial encoding

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend (when implemented)
cd backend
npm test

# ML Service (when implemented)
cd ml
pytest
```

## 📊 Performance Targets

- Single address match: <500ms
- OCR extraction: <2s per image
- Batch processing: <5 minutes for 1000 addresses
- Frontend load time: <3s
- ML matching accuracy: >95%

## 🗺️ Roadmap

### Phase 1: Core MVP ✅
- [x] Frontend with Google OAuth
- [x] Multi-page application
- [x] Protected routes
- [ ] Backend API
- [ ] ML matching service

### Phase 2: Enhanced Features
- [ ] OCR integration
- [ ] 3D visualization
- [ ] Real-time suggestions
- [ ] Explainable AI

### Phase 3: Production Ready
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Production deployment
- [ ] Monitoring and logging

## 👥 Team

Department of Posts, Government of India

## 📄 License

India Post Hackathon 2025

## 🤝 Contributing

This is a hackathon project. For production deployment:
1. Implement comprehensive testing
2. Add monitoring and logging
3. Set up CI/CD pipelines
4. Conduct security audit
5. Load testing and optimization

## 📞 Support

For questions or issues:
- Check documentation in `context.md`
- Review security guidelines in `SECURITY.md`
- See frontend-specific docs in `frontend/README.md`

---

**Built with ❤️ for India Post Hackathon 2025**

🏛️ Department of Posts | 🇮🇳 Government of India
