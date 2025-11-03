# 🚀 AI-Powered Delivery Post Office Identification System

## 🧠 Problem Understanding

India Post operates the world's largest postal network with over 165,000 post offices serving 19,000+ PIN codes nationwide. However, a critical operational challenge persists: **approximately 5% of daily mail articles contain incorrect or mismatched PIN codes**, leading to:

- Misrouted mail and delivery delays
- Customer dissatisfaction
- Operational inefficiencies at distribution hubs
- Increased costs from wasteful movement of mail

### The Dual Challenge

**Challenge 1: Customer-Side Complexity**
- Customers struggle to identify the correct PIN code for their address
- Information asymmetry between sender's knowledge and actual delivery infrastructure

**Challenge 2: Internal Operational Dynamics**
- India Post continuously evolves its delivery network through:
  - Nodal Delivery Centres (NDCs)
  - Delivery Hub consolidations
  - PIN code mergers for operational efficiency
- Dynamic nature of merged PINs makes it difficult for operators to keep pace
- Internal systems need real-time alignment between customer-facing PINs and operational routing PINs

### Current State

This project builds upon the **DIGIPIN system** — an open-source geospatial addressing infrastructure developed by the Department of Posts, India, in collaboration with IIT Hyderabad and NRSC (ISRO). 

**Current Repository Contains:**
- ✅ DIGIPIN backend API (Node.js + Express) for encoding/decoding geographic coordinates
- ✅ All India PIN Code Directory 2025 dataset (165,629+ entries with lat/long data)
- ✅ DIGIPIN technical documentation and specifications
- ❌ No AI-powered address matching/correction system yet
- ❌ No batch processing for address correction
- ❌ No visualization layer for delivery routing

### Target Solution

Develop an intelligent system that:
1. **Identifies correct delivery locations** for mail items with unclear/mismatched addresses
2. **Aligns with internal operational databases** for PIN code clubbing/mapping
3. **Suggests optimal destination** for dispatch and delivery
4. **Automates address correction** using ML-based scanning and matching
5. **Visualizes delivery routing** for transparency and verification

### User Stories

1. **Single Address Correction:** Upload parcel label (image) or paste incomplete address → system extracts, normalizes, and maps to correct DIGIPIN + delivery office
2. **Batch Processing:** Upload CSV with thousands of addresses → system corrects all and provides confidence scores + analytics
3. **Visual Verification:** View 3D visualization of routing path and delivery office location
4. **Operational Alignment:** System accounts for merged PINs and suggests actual operational delivery hub

### Constraints

* 15-hour hackathon build window
* Leverage existing DIGIPIN backend (already implemented)
* Use provided All India PIN Code Directory dataset
* Target: working AI system + impressive visual demo

---

## 🏗️ System Design

### Current Repository Structure

```
Hackathon/
├── digipin/                    # ✅ EXISTING - DIGIPIN Backend API
│   ├── server.js              # Express server entry point
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── digipin.js         # Core DIGIPIN encoding/decoding logic
│   │   └── routes/
│   │       └── digipin.routes.js  # API routes for encode/decode
│   ├── swagger.yaml           # API documentation
│   └── docs/                  # Technical documentation
│
├── post/                       # ✅ EXISTING - Data Assets
│   └── all_india_pincode_directory_2025.csv  # 165,629 post office records
│
├── context.md                  # This file
└── ps.md                       # Problem statement
```

### Target Architecture (To Be Built)

```
Hackathon/
├── digipin/                    # ✅ EXISTING - Base API (Keep as-is)
├── post/                       # ✅ EXISTING - Dataset
├── backend/                    # 🔨 TO BUILD - Extended Backend
│   ├── server.js
│   ├── routes/
│   │   ├── ocr.routes.js      # Image-to-text extraction
│   │   ├── match.routes.js    # Address matching & correction
│   │   └── batch.routes.js    # Bulk CSV processing
│   ├── services/
│   │   ├── pincode.service.js # Load & query PIN code dataset
│   │   └── digipin.service.js # Interface with DIGIPIN API
│   └── utils/
│       └── csv-parser.js
│
├── ml/                         # 🔨 TO BUILD - AI Microservice
│   ├── main.py                # FastAPI server
│   ├── requirements.txt
│   ├── models/
│   │   ├── embeddings.py      # Sentence transformers
│   │   └── matcher.py         # FAISS similarity search
│   └── utils/
│       ├── text_processor.py  # Address normalization
│       └── ocr.py             # OCR integration (Tesseract/EasyOCR)
│
├── frontend/                   # 🔨 TO BUILD - React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddressInput.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── ThreeDVisualization.jsx
│   │   │   └── BatchUpload.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
│
└── docker-compose.yml          # 🔨 TO BUILD - Container orchestration
```

### Component Specifications

#### 🖥️ Frontend (React + Vite + Tailwind + Three.js + Google OAuth)

**Purpose:** Interactive UI for address correction and visualization with secure authentication

**Key Features:**
- **Google OAuth 2.0 Authentication** for authorized personnel
- Address input form (text or image upload)
- Real-time address matching with confidence scores
- 2D map view (Mapbox/Leaflet) showing delivery office locations
- 3D postal sorting visualization (react-three-fiber)
- Batch CSV upload with progress tracking and results download
- Multi-page application with protected routes

**Pages:**
1. **Home (/)** - Landing page with product overview
2. **Login (/login)** - Google OAuth sign-in
3. **Dashboard (/dashboard)** - Main control panel with stats and quick actions
4. **Address Match (/address-match)** - Single address correction tool
5. **Batch Process (/batch-process)** - Bulk CSV processing
6. **Analytics (/analytics)** - Performance metrics and reports

**Tech Stack:**
- Vite + React 18
- React Router v7 for routing
- Tailwind CSS for styling
- Google OAuth 2.0 for authentication
- react-three-fiber + @react-three/drei for 3D
- Mapbox GL JS or Leaflet for maps
- Axios for API calls

**Authentication Details:**
- **Google OAuth Client ID:** `372975400843-ffr7c5j59nmga7tk2nbog6o5mjpgq11s.apps.googleusercontent.com`
- **Project:** Department of Posts, Govt. of India
- **Authorized Origins:** `http://localhost:5173`, `http://localhost:3000`
- **Redirect URIs:** `http://localhost:5173/google-callback`, `http://localhost:3000/google-callback`
- **Flow:** Client-side OAuth with access token stored in sessionStorage
- **Security:** Client Secret is NEVER exposed in frontend code or Docker images

**Security Measures:**
- Client Secret excluded from all frontend code
- Environment variables managed through .env.local (gitignored)
- Docker build uses build args (no secrets in image)
- Protected routes require authentication
- Session-based access control
- Nginx security headers in production

#### ⚙️ Backend Enhancement (Node.js + Express)

**Purpose:** Orchestrate AI services and manage data access

**New Endpoints to Build:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ocr/extract` | Extract text from uploaded parcel image |
| POST | `/api/match/address` | Match address to correct PIN + delivery office |
| POST | `/api/match/bulk` | Process CSV with multiple addresses |
| GET | `/api/pincode/:pin` | Lookup PIN code details from dataset |
| GET | `/api/pincode/search` | Search by office name or district |
| POST | `/api/validate` | Validate if PIN matches delivery office |

**Data Integration:**
- Load `all_india_pincode_directory_2025.csv` into memory or SQLite
- Build indexed lookup structures for fast querying
- Interface with DIGIPIN API for coordinate conversion

#### 🤖 ML Microservice (Python + FastAPI)

**Purpose:** AI-powered address normalization and matching

**Core Capabilities:**

1. **OCR Service** (`/api/ml/ocr`)
   - Extract text from parcel images
   - Use Tesseract OCR or EasyOCR
   - Return extracted address string

2. **Address Normalization** (`/api/ml/normalize`)
   - Clean and standardize address text
   - Handle abbreviations, misspellings
   - Extract structured components (city, state, PIN)

3. **Smart Matching** (`/api/ml/match`)
   - Convert addresses to embeddings using sentence-transformers
   - Use FAISS for similarity search across 165K+ post offices
   - Return top-5 candidates with confidence scores
   - Consider both textual similarity and geographic proximity

**Tech Stack:**
- FastAPI for API server
- sentence-transformers (MiniLM-L6) for embeddings
- FAISS for vector similarity search
- Tesseract OCR or EasyOCR
- pandas for dataset handling
- geopy for distance calculations

**Matching Algorithm:**
```python
def match_address(raw_text: str) -> List[Candidate]:
    # 1. Normalize text
    cleaned = normalize(raw_text)
    
    # 2. Generate embedding
    embedding = model.encode([cleaned])
    
    # 3. FAISS search
    distances, indices = index.search(embedding, k=10)
    
    # 4. Re-rank by geographic proximity if partial PIN available
    candidates = rerank_by_location(indices, distances, cleaned)
    
    # 5. Return top-5 with confidence scores
    return candidates[:5]
```

#### 🗺️ Data Layer

**Current State:**
- CSV file with 165,629 post office records
- Fields: circlename, regionname, divisionname, officename, pincode, officetype, delivery, district, statename, latitude, longitude

**Options:**

**Option A: In-Memory (Fast Prototyping)**
- Load CSV into pandas DataFrame
- Build FAISS index on office name + district + state embeddings
- Pre-compute DIGIPIN for all lat/long pairs
- ✅ Zero setup time, perfect for hackathon
- ⚠️ ~50MB memory footprint

**Option B: SQLite (Recommended)**
- Import CSV to SQLite database
- Create indexes on pincode, officename, district
- ~5 minutes setup time
- ✅ Fast queries, persistent storage

**Option C: PostgreSQL + PostGIS (If Time Permits)**
- Full spatial queries
- DIGIPIN grid integration
- ⚠️ Higher complexity, Docker setup required

**For 15-hour hackathon: Choose Option A or B**

#### 🐳 Infrastructure

**Development:**
- Run DIGIPIN API on port 5000 (already configured)
- ML service on port 8000
- Extended backend on port 3001
- Frontend on port 5173 (Vite default)

**Docker Compose (Optional):**
```yaml
services:
  digipin:
    build: ./digipin
    ports: ["5000:5000"]
  
  ml:
    build: ./ml
    ports: ["8000:8000"]
  
  backend:
    build: ./backend
    ports: ["3001:3001"]
    depends_on: [digipin, ml]
  
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
```

---

## 🕓 15-Hour Implementation Roadmap

### Phase 0: Setup & Planning (0.0 - 0.5h)
- ✅ Repository already initialized
- ✅ DIGIPIN API already working
- ✅ Dataset already available
- 🔨 Create folder structure for `backend/`, `ml/`, `frontend/`
- 🔨 Initialize git branches if needed

### Phase 1: Data Layer (0.5 - 1.5h)
**Goal:** Load and index PIN code dataset

**Tasks:**
- Load `all_india_pincode_directory_2025.csv` into memory/SQLite
- Build fast lookup structures (by PIN, by office name, by district)
- Pre-compute DIGIPIN codes for all 165K+ entries
- Create utility functions for querying

**Deliverable:** Working data service with query API

### Phase 2: ML Microservice - Core (1.5 - 4.0h)
**Goal:** Build AI matching engine

**Tasks:**
- FastAPI server setup
- Load sentence-transformer model (all-MiniLM-L6-v2)
- Generate embeddings for all post office records
- Build FAISS index for similarity search
- Implement `/match` endpoint with confidence scoring
- Address normalization utilities

**Deliverable:** Working ML API that can match addresses

### Phase 3: ML Microservice - OCR (4.0 - 5.0h)
**Goal:** Add image-to-text capability

**Tasks:**
- Integrate Tesseract OCR or EasyOCR
- Implement `/ocr` endpoint
- Handle image upload and preprocessing
- Test with sample parcel images

**Deliverable:** OCR endpoint that extracts addresses from images

### Phase 4: Backend API Extension (5.0 - 7.0h)
**Goal:** Build orchestration layer

**Tasks:**
- Express server setup (separate from DIGIPIN)
- `/api/match/address` - coordinate between ML and data services
- `/api/match/bulk` - CSV processing endpoint
- `/api/pincode/*` - dataset query endpoints
- Integration with DIGIPIN API for coordinate mapping
- CSV parsing and batch processing logic

**Deliverable:** Complete backend API with all endpoints

### Phase 5: Frontend - Core UI (7.0 - 10.0h)
**Goal:** Build functional React interface

**Tasks:**
- Vite + React + Tailwind setup
- Address input component (text + image upload)
- Display matching results with confidence
- Mapbox/Leaflet integration for location display
- Connect to backend APIs
- Error handling and loading states

**Deliverable:** Working web app for single address correction

### Phase 6: Frontend - 3D Visualization (10.0 - 12.0h)
**Goal:** Add impressive visual layer

**Tasks:**
- react-three-fiber setup
- 3D postal warehouse scene
- Animated parcel routing visualization
- Color-coding by confidence (green/orange/red)
- Camera controls and interactions
- Integration with map view (split screen)

**Deliverable:** 3D visualization of delivery routing

### Phase 7: Batch Processing UI (12.0 - 13.0h)
**Goal:** CSV upload and analytics

**Tasks:**
- CSV upload component
- Progress indicator for batch processing
- Results table with filtering/sorting
- Export corrected CSV
- Summary statistics and charts

**Deliverable:** Batch processing interface

### Phase 8: Integration & Testing (13.0 - 14.0h)
**Goal:** End-to-end system validation

**Tasks:**
- Test all API endpoints
- Test frontend flows
- Handle edge cases and errors
- Performance optimization
- Cross-service integration testing

**Deliverable:** Stable, working system

### Phase 9: Polish & Demo Prep (14.0 - 15.0h)
**Goal:** Final touches for presentation

**Tasks:**
- UI polish and animations
- Prepare demo script and sample data
- Create README with screenshots
- Record demo video (optional)
- Deploy to cloud if time permits

**Deliverable:** Production-ready demo

---

## 🎯 Minimum Viable Product (MVP) Scope

If time is limited, prioritize:

### Must-Have (Core MVP)
1. ✅ ML matching endpoint (address → PIN + office)
2. ✅ Backend API for address matching
3. ✅ Simple frontend with address input
4. ✅ Display top 3 matches with confidence
5. ✅ Map showing delivery office location

### Should-Have (Enhanced)
6. ✅ OCR for image upload
7. ✅ Batch CSV processing
8. ✅ 3D visualization

### Nice-to-Have (If Time Permits)
9. Real-time suggestions as user types
10. Explainable AI (show which tokens matched)
11. Delivery route optimization
12. Deployment to cloud

---

## 🧩 Data Schema & Integration

### DIGIPIN System (Existing)

**Core Functions:**
```javascript
getDigiPin(lat, lon)           // Returns: "4P3-JK8-52C9"
getLatLngFromDigiPin(digipin)  // Returns: {latitude, longitude}
```

**API Endpoints (Port 5000):**
- `POST /api/digipin/encode` - Convert lat/long → DIGIPIN
- `POST /api/digipin/decode` - Convert DIGIPIN → lat/long
- `GET /api/digipin/encode?latitude=X&longitude=Y`
- `GET /api/digipin/decode?digipin=XXX-XXX-XXXX`

### PIN Code Dataset Schema

**File:** `post/all_india_pincode_directory_2025.csv` (165,629 records)

**Columns:**
| Field | Type | Example | Description |
|-------|------|---------|-------------|
| circlename | String | "Telangana Circle" | Postal circle |
| regionname | String | "Hyderabad Region" | Regional division |
| divisionname | String | "Adilabad Division" | Sub-division |
| officename | String | "Kothimir B.O" | Post office name |
| pincode | Integer | 504273 | 6-digit PIN code |
| officetype | String | "BO" / "SO" / "HO" | Branch/Sub/Head Office |
| delivery | String | "Delivery" / "Non Delivery" | Delivery status |
| district | String | "KUMURAM BHEEM ASIFABAD" | District name |
| statename | String | "TELANGANA" | State name |
| latitude | Float | 19.3638689 | Latitude (WGS84) |
| longitude | Float | 79.5376658 | Longitude (WGS84) |

**Data Quality Notes:**
- Some records have `NA` for latitude/longitude
- Multiple offices can share the same PIN code
- Need to handle "Non Delivery" offices appropriately

### Extended Data Model (To Be Created)

**For ML Matching:**
```python
class PostOfficeRecord:
    pincode: str
    officename: str
    district: str
    state: str
    latitude: float
    longitude: float
    digipin: str          # Pre-computed
    embedding: ndarray    # 384-dim vector
    full_text: str        # "officename, district, state, pincode"
```

**For Address Matching Results:**
```typescript
interface MatchResult {
  rank: number;
  pincode: string;
  officename: string;
  district: string;
  state: string;
  digipin: string;
  latitude: number;
  longitude: number;
  confidence: number;     // 0-1 score
  similarity: number;     // Embedding similarity
  distance_km?: number;   // Geographic distance if input had coords
  matched_tokens: string[]; // Explainability
}
```

**For Batch Processing:**
```typescript
interface BatchItem {
  id: number;
  raw_address: string;
  extracted_text?: string;  // From OCR
  status: 'pending' | 'processing' | 'completed' | 'failed';
  best_match?: MatchResult;
  all_matches?: MatchResult[];
  processing_time_ms: number;
}
```

---

## 🧠 ML Matching Logic (Detailed)

### Address Normalization Pipeline

```python
def normalize_address(raw_text: str) -> str:
    """
    Clean and standardize address text
    """
    text = raw_text.lower()
    
    # Remove special characters
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    
    # Expand common abbreviations
    replacements = {
        'po': 'post office',
        'bo': 'branch office',
        'so': 'sub office',
        'dist': 'district',
        'nr': 'near',
        'rd': 'road',
        'st': 'street',
    }
    for abbr, full in replacements.items():
        text = text.replace(f' {abbr} ', f' {full} ')
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text
```

### Embedding-Based Matching

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Initialize model (384-dim embeddings)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Pre-compute embeddings for all post offices
def build_index(df):
    # Create searchable text for each office
    df['search_text'] = (
        df['officename'] + ' ' +
        df['district'] + ' ' +
        df['statename'] + ' ' +
        df['pincode'].astype(str)
    )
    
    # Generate embeddings
    texts = df['search_text'].tolist()
    embeddings = model.encode(texts, show_progress_bar=True)
    
    # Build FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)  # Inner product = cosine similarity
    
    # Normalize for cosine similarity
    faiss.normalize_L2(embeddings)
    index.add(embeddings)
    
    return index, embeddings

# Matching function
def match_address(query: str, top_k: int = 5):
    # Normalize and encode query
    normalized = normalize_address(query)
    query_embedding = model.encode([normalized])
    faiss.normalize_L2(query_embedding)
    
    # Search FAISS index
    similarities, indices = index.search(query_embedding, top_k * 2)
    
    # Get candidates
    candidates = []
    for sim, idx in zip(similarities[0], indices[0]):
        record = df.iloc[idx]
        
        # Skip if no coordinates
        if pd.isna(record['latitude']) or pd.isna(record['longitude']):
            continue
        
        candidates.append({
            'pincode': record['pincode'],
            'officename': record['officename'],
            'district': record['district'],
            'state': record['statename'],
            'latitude': record['latitude'],
            'longitude': record['longitude'],
            'similarity': float(sim),
            'confidence': calculate_confidence(sim, record, normalized)
        })
        
        if len(candidates) >= top_k:
            break
    
    return candidates

def calculate_confidence(similarity: float, record: dict, query: str) -> float:
    """
    Convert similarity score to confidence (0-1)
    Consider multiple factors
    """
    confidence = similarity  # Base confidence from embedding similarity
    
    # Boost if PIN code appears in query
    if str(record['pincode']) in query:
        confidence = min(1.0, confidence + 0.2)
    
    # Boost if exact office name match
    if record['officename'].lower() in query.lower():
        confidence = min(1.0, confidence + 0.15)
    
    # Boost if district name appears
    if record['district'].lower() in query.lower():
        confidence = min(1.0, confidence + 0.1)
    
    return confidence
```

### Geographic Re-Ranking (Optional Enhancement)

```python
from geopy.distance import geodesic

def rerank_with_location(candidates, user_lat, user_lon):
    """
    If user provides approximate location, re-rank by distance
    """
    for candidate in candidates:
        office_coords = (candidate['latitude'], candidate['longitude'])
        user_coords = (user_lat, user_lon)
        distance_km = geodesic(user_coords, office_coords).kilometers
        
        candidate['distance_km'] = distance_km
        
        # Adjust confidence based on distance
        if distance_km < 5:
            candidate['confidence'] = min(1.0, candidate['confidence'] + 0.1)
        elif distance_km > 50:
            candidate['confidence'] = max(0.0, candidate['confidence'] - 0.1)
    
    # Re-sort by confidence
    candidates.sort(key=lambda x: x['confidence'], reverse=True)
    return candidates
```
```

---

## 🖼️ Frontend Design & Visualization

### UI Layout

**Main Screen (Desktop):**
```
┌─────────────────────────────────────────────────────────┐
│  🏛️ India Post - AI Delivery System    [Upload] [Batch] │
├──────────────────┬──────────────────────────────────────┤
│                  │                                      │
│  Input Panel     │         Map View                     │
│                  │    (Mapbox/Leaflet)                  │
│  - Text Input    │                                      │
│  - Image Upload  │    [Show delivery office marker]    │
│  - Submit        │                                      │
│                  │                                      │
│  Results:        ├──────────────────────────────────────┤
│  ✓ Match 1 (95%) │                                      │
│  ✓ Match 2 (87%) │      3D Visualization                │
│  ✓ Match 3 (72%) │   (react-three-fiber)                │
│                  │                                      │
│  [Details]       │   [Animated parcel routing]         │
│                  │                                      │
└──────────────────┴──────────────────────────────────────┘
```

### 3D Visualization Concept

**Scene Elements:**
- **Postal Warehouse:** Low-poly 3D building
- **Parcels:** Colored boxes representing mail items
  - 🟢 Green: Confidence > 0.8
  - 🟡 Orange: Confidence 0.5 - 0.8
  - 🔴 Red: Confidence < 0.5
- **Sorting Bins:** Labeled by delivery office
- **Animation:** Parcels move from input conveyor → correct bin
- **Camera:** Smooth flyover showing the routing process

**Tech Implementation:**
```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

function ParcelBox({ position, color, confidence }) {
  const springs = useSpring({
    position: position,
    config: { tension: 120, friction: 14 }
  })
  
  return (
    <animated.mesh position={springs.position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  )
}

function PostalWarehouse({ matches }) {
  return (
    <Canvas camera={{ position: [10, 10, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {matches.map((match, i) => (
        <ParcelBox
          key={i}
          position={[i * 2, 5, 0]}
          color={getConfidenceColor(match.confidence)}
          confidence={match.confidence}
        />
      ))}
      
      <OrbitControls />
    </Canvas>
  )
}
```

### Map Integration

**Features:**
- Display delivery office location with marker
- Show DIGIPIN grid overlay (optional)
- User location vs delivery office route
- Multiple matches shown with different marker colors

**Mapbox Example:**
```jsx
import Map, { Marker, Source, Layer } from 'react-map-gl'

function DeliveryMap({ matches, userLocation }) {
  return (
    <Map
      mapboxAccessToken={process.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        longitude: matches[0].longitude,
        latitude: matches[0].latitude,
        zoom: 10
      }}
      style={{ width: '100%', height: '400px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {matches.map((match, i) => (
        <Marker
          key={i}
          longitude={match.longitude}
          latitude={match.latitude}
          color={getConfidenceColor(match.confidence)}
        >
          <div className="marker-tooltip">
            {match.officename}
            <br />
            PIN: {match.pincode}
            <br />
            Confidence: {(match.confidence * 100).toFixed(0)}%
          </div>
        </Marker>
      ))}
    </Map>
  )
}
```

### Batch Processing UI

**CSV Upload Flow:**
1. User uploads CSV with address column
2. Frontend sends to `/api/match/bulk`
3. Backend processes in batches (100 at a time)
4. Real-time progress updates via WebSocket or polling
5. Display results in sortable table
6. Export corrected CSV with new columns: `matched_pincode`, `matched_office`, `confidence`, `digipin`

**Results Table:**
```jsx
<DataTable
  columns={[
    { header: 'Original Address', accessor: 'raw_address' },
    { header: 'Matched Office', accessor: 'matched_office' },
    { header: 'PIN Code', accessor: 'matched_pincode' },
    { header: 'DIGIPIN', accessor: 'digipin' },
    { header: 'Confidence', accessor: 'confidence', 
      render: (val) => <ConfidenceBadge value={val} /> }
  ]}
  data={results}
  onExport={downloadCSV}
/>
```

---

## 💡 Innovation & Special Features

### 1. Real-Time Auto-Correct
As user types address, show live suggestions with confidence scores

### 2. Explainable AI
Highlight which parts of the address contributed to the match
```json
{
  "matched_tokens": {
    "pincode": "504273",
    "district": "KUMURAM BHEEM ASIFABAD",
    "office": "Kothimir"
  },
  "explanation": "Matched based on PIN code (50% weight), district name (30% weight), and partial office name (20% weight)"
}
```

### 3. Merged PIN Handling
India Post merges PINs for operational efficiency. System should:
- Detect if a PIN has been merged
- Show the operational delivery hub
- Display historical vs current routing

### 4. Confidence Calibration
Different confidence thresholds for different use cases:
- **Critical Mail (>0.9):** Legal documents, financial instruments
- **Standard Mail (>0.7):** Regular parcels, letters
- **Bulk Mail (>0.5):** Marketing materials

### 5. Offline Mode (Stretch Goal)
Package ML model + dataset for edge deployments at post offices

### 6. Multi-Language Support
Handle addresses in regional languages (Hindi, Telugu, Tamil, etc.)
- Use transliteration APIs
- Train embeddings on transliterated data

### 7. Address Standardization Export
Generate standardized address format for printing:
```
Mr. John Doe
Kothimir Branch Office
District: Kumuram Bheem Asifabad
Telangana - 504273
DIGIPIN: 4P3-JK8-52C9
```

### 8. Analytics Dashboard
For batch processing, show:
- Success rate distribution
- Geographic heatmap of corrections
- Most commonly mismatched offices
- Average confidence by region

---

## 🧩 Complete API Specification

### DIGIPIN API (Existing - Port 5000)

| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| GET | `/api/digipin/encode` | `?latitude=12.97&longitude=77.59` | `{"digipin": "4P3-JK8-52C9"}` | Encode coordinates |
| POST | `/api/digipin/encode` | `{"latitude": 12.97, "longitude": 77.59}` | `{"digipin": "4P3-JK8-52C9"}` | Encode coordinates |
| GET | `/api/digipin/decode` | `?digipin=4P3-JK8-52C9` | `{"latitude": "12.971601", "longitude": "77.594584"}` | Decode DIGIPIN |
| POST | `/api/digipin/decode` | `{"digipin": "4P3-JK8-52C9"}` | `{"latitude": "12.971601", "longitude": "77.594584"}` | Decode DIGIPIN |

### ML Service API (To Build - Port 8000)

| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/ml/ocr` | `multipart/form-data` with image | `{"extracted_text": "..."}` | Extract address from image |
| POST | `/api/ml/normalize` | `{"text": "raw address"}` | `{"normalized": "cleaned text"}` | Normalize address |
| POST | `/api/ml/match` | `{"text": "address", "top_k": 5}` | Array of `MatchResult` | Find matching offices |

### Backend API (To Build - Port 3001)

| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/address/match` | `{"address": "text"}` or `{"image": file}` | `{"matches": [...]}` | Match address to office |
| GET | `/api/pincode/:pin` | - | Post office details | Lookup by PIN code |
| GET | `/api/pincode/search` | `?q=office+name` | Array of offices | Search offices |
| POST | `/api/batch/upload` | CSV file | `{"job_id": "uuid"}` | Start batch job |
| GET | `/api/batch/status/:id` | - | `{"progress": 0.75, "results": [...]}` | Check batch status |
| GET | `/api/batch/download/:id` | - | CSV file | Download results |
| POST | `/api/validate` | `{"pincode": "504273", "office": "Kothimir"}` | `{"valid": true/false}` | Validate PIN-office pair |

### Request/Response Examples

**Match Address Request:**
```json
POST /api/address/match
{
  "address": "Kothimir post office, Asifabad district, Telangana 504273",
  "options": {
    "top_k": 3,
    "include_digipin": true,
    "user_location": {
      "latitude": 19.36,
      "longitude": 79.53
    }
  }
}
```

**Match Address Response:**
```json
{
  "query": "Kothimir post office, Asifabad district, Telangana 504273",
  "normalized_query": "kothimir post office asifabad district telangana 504273",
  "matches": [
    {
      "rank": 1,
      "pincode": "504273",
      "officename": "Kothimir B.O",
      "district": "KUMURAM BHEEM ASIFABAD",
      "state": "TELANGANA",
      "digipin": "4P3-JK8-52C9",
      "latitude": 19.3638689,
      "longitude": 79.5376658,
      "confidence": 0.95,
      "similarity": 0.92,
      "distance_km": 1.2,
      "matched_tokens": ["kothimir", "asifabad", "504273"],
      "officetype": "BO",
      "delivery": "Delivery"
    },
    {
      "rank": 2,
      "pincode": "504296",
      "officename": "Kammergaon B.O",
      "confidence": 0.67,
      "...": "..."
    }
  ],
  "processing_time_ms": 145
}
```

**Batch Upload Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_rows": 1000,
  "status": "processing",
  "created_at": "2025-11-03T10:30:00Z"
}
```

---

## 🎨 UI/UX Design Guidelines

### Design Theme
- **Color Palette:**
  - Primary: India Post Red (#E31E24)
  - Secondary: Deep Blue (#003366)
  - Success: Green (#10B981)
  - Warning: Orange (#F59E0B)
  - Error: Red (#EF4444)
  - Background: Dark gradient (#0F172A → #1E293B)

- **Typography:**
  - Headers: Inter Bold
  - Body: Inter Regular
  - Monospace (for DIGIPIN): JetBrains Mono

### Component Library
Use **Tailwind CSS** + **Headless UI** for consistency

**Key Components:**
- `<ConfidenceBadge />` - Color-coded score display
- `<AddressCard />` - Display matched office details
- `<MapMarker />` - Custom markers for delivery offices
- `<LoadingSpinner />` - India Post themed loader
- `<FileUpload />` - Drag-and-drop zone for images/CSV

### Micro-Interactions
- Smooth transitions (200ms ease-out)
- Hover effects on cards and buttons
- Loading states with skeleton screens
- Success animations when match found
- Error shake animation for failed uploads

### Responsive Design
- Desktop: Split view (input/results | map/3D)
- Tablet: Stacked view with tabs
- Mobile: Single column, swipeable cards

---

## 🧭 Implementation Checklist

### ✅ Already Done
- [x] DIGIPIN API implementation
- [x] DIGIPIN encoding/decoding algorithms
- [x] API documentation (Swagger)
- [x] All India PIN Code dataset acquired
- [x] Repository structure initialized

### 🔨 To Build - Backend (Node.js)

**Setup & Configuration:**
- [ ] Initialize Express server on port 3001
- [ ] Setup CORS for frontend communication
- [ ] Environment variables configuration
- [ ] Error handling middleware

**Data Layer:**
- [ ] CSV parser for PIN code dataset
- [ ] In-memory data store or SQLite setup
- [ ] Indexing structure for fast lookups
- [ ] Pre-compute DIGIPIN for all records
- [ ] Query utilities (by PIN, by name, by district)

**API Endpoints:**
- [ ] POST `/api/address/match` - Main matching endpoint
- [ ] GET `/api/pincode/:pin` - PIN lookup
- [ ] GET `/api/pincode/search` - Search offices
- [ ] POST `/api/batch/upload` - CSV upload
- [ ] GET `/api/batch/status/:id` - Job status
- [ ] GET `/api/batch/download/:id` - Download results
- [ ] POST `/api/validate` - Validate PIN-office pair

**Integration:**
- [ ] Integrate with ML service
- [ ] Integrate with DIGIPIN API
- [ ] Batch processing queue
- [ ] CSV generation for results

### 🤖 To Build - ML Service (Python)

**Setup:**
- [ ] FastAPI server on port 8000
- [ ] Virtual environment setup
- [ ] Install dependencies (sentence-transformers, faiss, etc.)

**Core ML:**
- [ ] Load sentence-transformer model
- [ ] Generate embeddings for all post offices
- [ ] Build FAISS index
- [ ] Address normalization utilities
- [ ] Confidence scoring algorithm

**OCR Integration:**
- [ ] Tesseract OCR or EasyOCR setup
- [ ] Image preprocessing
- [ ] Text extraction endpoint

**API Endpoints:**
- [ ] POST `/api/ml/ocr` - Image to text
- [ ] POST `/api/ml/normalize` - Text normalization
- [ ] POST `/api/ml/match` - Similarity search

### 🎨 To Build - Frontend (React)

**Setup:**
- [ ] Vite + React project initialization
- [ ] Tailwind CSS configuration
- [ ] Install dependencies (three, mapbox, etc.)
- [ ] Environment variables for API URLs

**Core Components:**
- [ ] AddressInput component (text + image)
- [ ] MatchResults component (display matches)
- [ ] ConfidenceBadge component
- [ ] MapView component (Mapbox/Leaflet)
- [ ] ThreeDVisualization component
- [ ] BatchUpload component

**Pages:**
- [ ] Home page with address input
- [ ] Results page with map + 3D view
- [ ] Batch processing page

**API Integration:**
- [ ] API service layer (axios)
- [ ] Error handling
- [ ] Loading states

**3D Visualization:**
- [ ] react-three-fiber canvas setup
- [ ] 3D warehouse model
- [ ] Parcel animation
- [ ] Camera controls

**Map Integration:**
- [ ] Mapbox/Leaflet setup
- [ ] Custom markers
- [ ] Tooltips and popups
- [ ] Route visualization

### 🐳 DevOps (Optional)

- [ ] Dockerfile for each service
- [ ] Docker Compose configuration
- [ ] Environment variable management
- [ ] Volume mounts for data persistence

### 🧪 Testing & Polish

- [ ] API endpoint testing
- [ ] ML model accuracy validation
- [ ] Frontend component testing
- [ ] End-to-end flow testing
- [ ] Performance optimization
- [ ] UI polish and animations

### 📄 Documentation

- [ ] README with setup instructions
- [ ] API documentation
- [ ] Demo script preparation
- [ ] Screenshots/video recording

---

## 🤖 AI Agent Development Prompt

> You are an expert full-stack developer tasked with building an **AI-Powered Delivery Post Office Identification System** for India Post.
>
> ### Context:
> - India Post has 165,000+ post offices with ~19,000 PIN codes
> - 5% of daily mail has incorrect/mismatched PIN codes causing delivery delays
> - The repository already contains:
>   - ✅ Working DIGIPIN API (geospatial encoding system)
>   - ✅ All India PIN Code Directory 2025 (165,629 records with lat/long)
>   - ✅ Technical documentation
>
> ### Your Mission:
> Build a complete system with three components:
>
> **1. ML Microservice (Python + FastAPI):**
> - Load sentence-transformer model (all-MiniLM-L6-v2)
> - Generate embeddings for all 165K+ post office records
> - Build FAISS index for similarity search
> - Implement endpoints:
>   - POST `/api/ml/ocr` - Extract address from image (Tesseract/EasyOCR)
>   - POST `/api/ml/normalize` - Clean address text
>   - POST `/api/ml/match` - Return top-5 office matches with confidence scores
> - Address normalization: lowercase, expand abbreviations, remove special chars
> - Confidence scoring: combine embedding similarity + PIN code match + geographic distance
>
> **2. Backend API (Node.js + Express):**
> - Load `post/all_india_pincode_directory_2025.csv` into memory/SQLite
> - Pre-compute DIGIPIN for all records using existing DIGIPIN API
> - Build fast lookup indexes (by PIN, office name, district)
> - Implement endpoints:
>   - POST `/api/address/match` - Orchestrate ML + data lookup
>   - GET `/api/pincode/:pin` - Lookup by PIN code
>   - GET `/api/pincode/search` - Search offices by name/district
>   - POST `/api/batch/upload` - Handle CSV uploads
>   - GET `/api/batch/status/:id` - Job status
>   - GET `/api/batch/download/:id` - Download corrected CSV
> - Integrate with DIGIPIN API (localhost:5000) for coordinate conversion
>
> **3. Frontend (React + Vite + Tailwind + Three.js):**
> - Modern, responsive UI with India Post branding
> - Components:
>   - Address input (text or image upload)
>   - Display top matches with confidence badges
>   - 2D map (Mapbox/Leaflet) showing office locations
>   - 3D postal warehouse visualization (react-three-fiber)
>   - Batch CSV upload with progress tracking
> - 3D visualization: animated parcels color-coded by confidence (green/orange/red)
> - Split screen: left (input/results) | right (map/3D)
>
> ### Technical Requirements:
> - ML Service: Python 3.9+, FastAPI, sentence-transformers, faiss-cpu, pytesseract/easyocr
> - Backend: Node.js 18+, Express, csv-parser, axios
> - Frontend: React 18, Vite, Tailwind, react-three-fiber, mapbox-gl/leaflet
> - Data handling: Handle NA values in lat/long, skip "Non Delivery" offices
> - Performance: Optimize for 15-hour hackathon delivery
>
> ### Deliverables:
> 1. Working ML service with >80% matching accuracy
> 2. Complete backend API with all endpoints
> 3. Interactive frontend with map + 3D visualization
> 4. Batch processing capability (handle 1000+ addresses)
> 5. README with setup instructions
> 6. Demo-ready system
>
> ### Success Criteria:
> - System correctly identifies delivery office for messy addresses
> - Confidence scores accurately reflect match quality
> - 3D visualization is smooth and impressive
> - Batch processing completes in <5 minutes for 1000 addresses
> - UI is intuitive and professional
>
> **Start by creating the folder structure, then build ML service first (critical path), then backend, then frontend.**

---

## 🧪 Testing Strategy & Demo Preparation

### Test Data Preparation

**Sample Addresses for Testing:**
```
1. "Kothimir post office, Asifabad, Telangana 504273" (Exact match)
2. "Kothmir BO near Asifabad dist TG" (Misspelled, abbreviated)
3. "Post office Papanpet 504299" (Partial info)
4. "Vempalli Branch, Mancherial district" (Missing PIN)
5. "Yellapur Warangal" (Ambiguous - multiple matches)
```

**CSV for Batch Testing:**
Create `test_addresses.csv` with 100-1000 sample rows:
```csv
id,raw_address
1,"Kothimir post office, Asifabad, Telangana 504273"
2,"Papanpet BO, Adilabad division"
3,"Vempalli Branch Office Mancherial"
...
```

### Demo Script (5-minute presentation)

**Minute 1: Problem Statement**
- Show India Post statistics (165K offices, 5% error rate)
- Explain customer pain point + operational challenge
- Introduce solution vision

**Minute 2: Single Address Demo**
- Upload messy parcel image OR type incomplete address
- Show real-time OCR extraction
- Display top 3 matches with confidence scores
- Highlight correct match on map
- Show 3D visualization of routing

**Minute 3: Batch Processing Demo**
- Upload CSV with 100 addresses
- Show progress bar
- Display results table with corrections
- Export corrected CSV
- Show analytics: success rate, confidence distribution

**Minute 4: Technical Highlights**
- Architecture diagram
- AI matching algorithm (embeddings + FAISS)
- DIGIPIN integration
- Performance metrics

**Minute 5: Impact & Future**
- Potential to reduce 5% error rate → savings in crores
- Scalability to all 165K post offices
- Future enhancements (multilingual, merged PINs, etc.)

### Known Challenges & Solutions

**Challenge 1: Missing Lat/Long for Some Records**
- **Issue:** Some CSV rows have `NA` for coordinates
- **Solution:** Skip these during FAISS index building, or geocode using district/state

**Challenge 2: Ambiguous Office Names**
- **Issue:** "Yellapur" exists in multiple districts
- **Solution:** Use district + state in matching, require user to select

**Challenge 3: OCR Quality**
- **Issue:** Handwritten addresses hard to read
- **Solution:** Pre-process image (denoise, contrast), show confidence, allow manual correction

**Challenge 4: Large Dataset Memory**
- **Issue:** 165K embeddings = ~250MB RAM
- **Solution:** Use FAISS quantization, or disk-backed index

**Challenge 5: Performance**
- **Issue:** Batch processing 1000 addresses takes time
- **Solution:** Process in parallel batches of 100, show progress

**Challenge 6: Merged PINs**
- **Issue:** Operational PINs differ from customer-facing PINs
- **Solution:** Phase 2 feature - requires additional PIN mapping dataset

### Performance Benchmarks

**Target Metrics:**
- Single address match: <500ms
- OCR extraction: <2s per image
- Batch processing: <5 minutes for 1000 addresses
- Frontend load time: <3s
- 3D visualization FPS: >30fps

### Backup Plans

**If short on time:**
1. Skip OCR, focus on text input
2. Skip 3D visualization, use only map
3. Skip batch processing, focus on single address
4. Use mock data for demos instead of full dataset

**If technical issues:**
1. ML service down → Use fallback regex-based matching
2. DIGIPIN API down → Use pre-computed values
3. Map API down → Show text results only
4. 3D crashes → Disable and use 2D only

---

## 📚 Reference Resources

### DIGIPIN Documentation
- Technical Document: `/digipin/docs/DIGIPIN_Technical_Document.md`
- API Docs: `http://localhost:5000/api-docs`

### Dataset
- All India PIN Code Directory: `/post/all_india_pincode_directory_2025.csv`
- 165,629 records with lat/long coordinates

### Libraries & Tools

**ML/AI:**
- sentence-transformers: https://www.sbert.net/
- FAISS: https://github.com/facebookresearch/faiss
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract
- EasyOCR: https://github.com/JaidedAI/EasyOCR

**Backend:**
- Express: https://expressjs.com/
- csv-parser: https://www.npmjs.com/package/csv-parser
- axios: https://axios-http.com/

**Frontend:**
- Vite: https://vitejs.dev/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Mapbox GL JS: https://docs.mapbox.com/mapbox-gl-js/
- Leaflet: https://leafletjs.com/
- Tailwind CSS: https://tailwindcss.com/

### External APIs (If Needed)
- Mapbox (requires API key): https://www.mapbox.com/
- Alternative: Use Leaflet with OpenStreetMap (no key required)

---

This comprehensive context document provides everything needed to build the AI-Powered Delivery Post Office Identification System in a 15-hour hackathon timeframe.
