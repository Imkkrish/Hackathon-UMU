# 🚀 AI-Powered Delivery Post Office Identification System

## 🧠 Problem Understanding

The project aims to transform messy or incomplete postal addresses into precise delivery targets using AI. It builds upon the DIGIPIN system ([https://github.com/CEPT-VZG/digipin](https://github.com/CEPT-VZG/digipin)) — an open-source postal lookup platform — to develop an intelligent, visually impressive full-stack solution that demonstrates automatic correction, confidence scoring, and visualization of delivery routing in 3D.

### Core Challenges

* Customers often use incorrect or incomplete PIN codes, leading to misrouted mail.
* The India Post network frequently merges or modifies PINs dynamically.
* Need an AI-driven system that can interpret raw postal addresses, map them to accurate delivery offices, and visualize routing for transparency.

### User Stories

1. Upload a parcel label (image) or paste an incomplete address → system extracts and normalizes it.
2. The AI system identifies the most probable DIGIPIN and delivery office.
3. The frontend visualizes the routing with 3D animations and maps.
4. Users can upload CSV batches for large-scale address correction demos.

### Constraints

* 15-hour hackathon build window
* Uses existing DIGIPIN backend locally
* Target: visually stunning demo with practical AI backend

---

## 🏗️ System Design

### Architecture Overview

```
frontend/ (React + Vite + Tailwind + Three.js)
backend/ (Node.js + Express)
ml/ (Python + FastAPI)
infra/ (Docker Compose for all services)
```

### Components

#### 🖥️ Frontend (React + Tailwind + Three.js)

* Built with **Vite** for fast iteration
* Uses **react-three-fiber** for 3D postal sorting animation
* Map view via **Mapbox GL / Leaflet** with DIGIPIN overlay
* Real-time confidence visualization and interaction

#### ⚙️ Backend (Node.js + Express)

* Acts as orchestrator and API gateway
* Endpoints:

  * `/api/ocr`: Extract address text from image using OCR
  * `/api/normalize`: Clean and standardize raw address text
  * `/api/route`: Predict the best matching DIGIPIN and delivery office
  * `/api/batch`: Handle bulk address correction via CSV
* Interfaces with the DIGIPIN PostgreSQL database for canonical lookups

#### 🤖 ML Microservice (Python + FastAPI)

* NLP-based address normalization & matching service
* Uses **sentence-transformers (MiniLM)** for text embeddings
* **FAISS** for similarity search among canonical addresses
* Returns top-k candidates with confidence scores

#### 🗺️ Database Layer

* **PostgreSQL + PostGIS** for spatial queries (DIGIPIN grid, post office mapping)
* **Redis** for caching frequent lookups

#### 🐳 DevOps & Infra

* **Docker Compose** orchestrates all services
* **GitHub Actions** for CI (lint + test)
* Deployment-ready setup for Render / Railway / Vercel

---

## 🕓 15-Hour Implementation Roadmap

| Time       | Task                                                     | Deliverable                                      |
| ---------- | -------------------------------------------------------- | ------------------------------------------------ |
| 0.0–0.5h   | Clone DIGIPIN + Setup mono-repo structure                | `frontend/`, `backend/`, `ml/`, `infra/` folders |
| 0.5–2.0h   | Docker Compose setup + load DIGIPIN dataset into PostGIS | Working DB + sample query                        |
| 2.0–5.0h   | Backend API (Express) with OCR + lookup endpoints        | Functional API server                            |
| 5.0–8.0h   | ML Microservice (FastAPI) with embedding & FAISS search  | AI inference ready                               |
| 8.0–11.0h  | Frontend skeleton (Vite + React + Tailwind + Mapbox)     | Address input + map results                      |
| 11.0–13.0h | 3D animation scene (react-three-fiber)                   | Parcel routing visualization                     |
| 13.0–14.0h | Batch processing + CSV upload demo                       | Analytics & summary view                         |
| 14.0–15.0h | Testing + polish + demo preparation                      | Working prototype + presentation                 |

---

## 🧩 Database Schema (Simplified)

### Table: `digipin`

| Column      | Type            | Description          |
| ----------- | --------------- | -------------------- |
| id          | serial          | Primary key          |
| digipin     | text            | PIN code             |
| geom        | geometry(Point) | Geolocation          |
| office_name | text            | Delivery office name |
| state       | text            | State name           |
| metadata    | jsonb           | Additional info      |

### Table: `submissions`

| Column         | Type      | Description               |
| -------------- | --------- | ------------------------- |
| id             | serial    | Primary key               |
| raw_text       | text      | Original address input    |
| extracted_text | text      | OCR or normalized text    |
| best_digipin   | text      | Predicted PIN             |
| best_office    | text      | Predicted delivery office |
| confidence     | numeric   | Confidence score          |
| created_at     | timestamp | Submission time           |

---

## 🧠 ML Microservice Logic (Pseudo)

```python
@app.post("/match")
def match(addr: dict):
    text = preprocess(addr['text'])
    emb = model.encode([text])
    D, I = index.search(emb, k=5)
    candidates = []
    for idx in I[0]:
        row = digipin_db[idx]
        candidates.append({
            'digipin': row['digipin'],
            'office': row['office'],
            'score': float(D[0][idx])
        })
    return {'candidates': candidates}
```

---

## 🖼️ Frontend & 3D Visualization

### Features

* Split screen: left = Map view, right = 3D warehouse scene
* 3D parcels color-coded by confidence (green > 0.8, orange 0.5–0.8, red < 0.5)
* Animations for parcel routing to correct delivery bin
* Hover tooltips for post office details

### Tools

* `react-three-fiber` + `@react-three/drei` + `react-spring`
* `Mapbox GL JS` for 2D map view
* `Framer Motion` for UI animations

---

## 💡 Innovation Opportunities

1. **AI Auto-Correct in Real-Time:** Suggest best match dynamically as user types.
2. **Explainable Confidence:** Show which tokens influenced predictions.
3. **3D Postal Routing Visualization:** Interactive demo with camera flyovers.
4. **Batch Analytics Mode:** Heatmap of mismatched vs corrected addresses.
5. **Offline Mode:** Package ML + DIGIPIN DB for edge deployments.

---

## 🧩 API Specification

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/upload-image` | Extracts text using OCR           |
| POST   | `/api/normalize`    | Normalizes address text           |
| POST   | `/api/match`        | Returns ranked DIGIPIN candidates |
| GET    | `/api/digipin/:pin` | Metadata lookup                   |
| POST   | `/api/batch`        | Bulk address correction via CSV   |

---

## 🎨 UI Design Summary

* Theme: dark gradient + neon postal visualization
* 3D postal warehouse animation (low-poly, efficient)
* Hero section with animated parcels, micro-UX transitions
* Map overlay highlighting DIGIPIN grids

---

## 🧭 Deliverables Checklist

✅ Frontend demo (Vercel / Netlify)
✅ Backend + ML microservice (Dockerized)
✅ DIGIPIN dataset loaded locally
✅ Working OCR + normalization + matching pipeline
✅ Interactive 3D routing visualization
✅ 1-page README + short demo script

---

## 🤖 AI Agent Prompt

> You are an AI coding assistant. Build a full-stack MERN system that extends DIGIPIN ([https://github.com/CEPT-VZG/digipin](https://github.com/CEPT-VZG/digipin)) into an AI-powered Delivery Post Office Identification System.
>
> **Requirements:**
>
> * Use mono-repo with `frontend/`, `backend/`, `ml/`, and `infra/`.
> * Backend (Node.js + Express): Implement `/api/ocr`, `/api/normalize`, `/api/route`, `/api/batch`.
> * ML Service (FastAPI): Create `/match` endpoint using sentence-transformers + FAISS to return top-5 DIGIPIN candidates with scores.
> * Database: Postgres + PostGIS + Redis (Docker Compose setup).
> * Frontend: React + Tailwind + react-three-fiber + Mapbox. Build interactive UI for upload, map view, and 3D parcel routing visualization.
> * Output: Containerized system, ready-to-run locally with `docker-compose up`.
> * Optimize for 15-hour hackathon delivery and visual demo impact.

---

This document represents the **complete context window** for building the project in an AI agent or hackathon environment.
