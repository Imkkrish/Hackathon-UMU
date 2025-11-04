# Backend API - India Post AI Delivery System

## Overview
Backend API service that orchestrates address matching, PIN code lookups, and batch processing for the AI-Powered Delivery Post Office Identification System.

## Architecture

```
Backend (Port 3001)
├── Express Server
├── Data Service (PIN code dataset)
├── ML Service Integration
├── DIGIPIN Service Integration
└── Batch Processing Engine
```

## Features

- ✅ RESTful API with Express
- ✅ Address matching (text + image)
- ✅ PIN code lookups and validation
- ✅ Batch CSV processing
- ✅ Integration with ML and DIGIPIN services
- ✅ Health checks and monitoring
- ✅ Security (Helmet, CORS, Rate limiting)
- ✅ Error handling and logging

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- ML service running on port 8000
- DIGIPIN service running on port 5000

### Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start the server:**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

#### GET /api/health
Check the health of all services

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-04T...",
  "uptime": 123.45,
  "responseTime": 45,
  "services": {
    "backend": {
      "status": "healthy",
      "dataService": {
        "status": "healthy",
        "totalRecords": 165629,
        "uniquePincodes": 19263,
        "uniqueOffices": 151234,
        "uniqueDistricts": 739,
        "uniqueStates": 36
      }
    },
    "ml": {
      "status": "healthy",
      "model_loaded": true,
      "index_loaded": true
    },
    "digipin": {
      "status": "healthy"
    }
  }
}
```

### Address Matching

#### POST /api/address/match
Match address text or image to post offices

**Request (Text):**
```json
{
  "address": "Kothimir post office Asifabad Telangana",
  "top_k": 3,
  "include_digipin": true
}
```

**Request (Image):**
```
Content-Type: multipart/form-data

file: <image file>
top_k: 3
```

**Response:**
```json
{
  "success": true,
  "query": "kothimir post office asifabad telangana",
  "matches": [
    {
      "rank": 1,
      "officename": "Kothimir B.O",
      "district": "KUMURAM BHEEM ASIFABAD",
      "state": "TELANGANA",
      "pincode": "504273",
      "digipin": "4A7-B2C-9D5E1F",
      "latitude": 19.3638689,
      "longitude": 79.5376658,
      "confidence": 0.95,
      "similarity": 0.92,
      "officetype": "BO",
      "matched_tokens": ["kothimir", "asifabad", "telangana"]
    }
  ],
  "processing_time_ms": 145,
  "timestamp": "2025-11-04T..."
}
```

#### POST /api/address/validate
Validate if address matches expected values

**Request:**
```json
{
  "address": "Kothimir post office Asifabad",
  "expectedPincode": "504273",
  "expectedOffice": "Kothimir"
}
```

**Response:**
```json
{
  "valid": true,
  "confidence": 0.95,
  "match": {
    "officename": "Kothimir B.O",
    "pincode": "504273",
    "district": "KUMURAM BHEEM ASIFABAD",
    "state": "TELANGANA"
  },
  "checks": {
    "pincodeMatches": true,
    "officeMatches": true
  }
}
```

### PIN Code Lookups

#### GET /api/pincode/:pin
Get post office details by PIN code

**Example:** `GET /api/pincode/504273`

**Response:**
```json
{
  "pincode": "504273",
  "count": 5,
  "offices": [
    {
      "circlename": "Telangana Circle",
      "regionname": "Hyderabad Region",
      "divisionname": "Adilabad Division",
      "officename": "Kothimir B.O",
      "pincode": "504273",
      "officetype": "BO",
      "delivery": "Delivery",
      "district": "KUMURAM BHEEM ASIFABAD",
      "statename": "TELANGANA",
      "latitude": 19.3638689,
      "longitude": 79.5376658,
      "digipin": "4A7-B2C-9D5E1F"
    }
  ]
}
```

#### GET /api/pincode/search/query?q=kothimir&limit=50
Search post offices by name, district, or state

**Response:**
```json
{
  "query": "kothimir",
  "count": 5,
  "limit": 50,
  "results": [...]
}
```

#### POST /api/pincode/validate
Validate if PIN code matches office name

**Request:**
```json
{
  "pincode": "504273",
  "officename": "Kothimir B.O"
}
```

**Response:**
```json
{
  "valid": true,
  "office": {
    "officename": "Kothimir B.O",
    "pincode": "504273",
    "district": "KUMURAM BHEEM ASIFABAD",
    ...
  }
}
```

#### GET /api/pincode/district/:name
Get post offices by district

**Example:** `GET /api/pincode/district/asifabad?limit=100`

#### GET /api/pincode/state/:name
Get post offices by state

**Example:** `GET /api/pincode/state/telangana?limit=100`

### Batch Processing

#### POST /api/batch/upload
Upload CSV file for batch processing

**Request:**
```
Content-Type: multipart/form-data

file: <CSV file>
addressColumn: "address" (optional, default: "address")
```

**Response:**
```json
{
  "success": true,
  "message": "Batch processing started",
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "statusUrl": "/api/batch/status/550e8400...",
  "downloadUrl": "/api/batch/download/550e8400..."
}
```

#### GET /api/batch/status/:jobId
Get status of batch processing job

**Response:**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 65,
  "total": 1000,
  "processed": 650,
  "successful": 620,
  "failed": 30,
  "resultsAvailable": 650,
  "startTime": "2025-11-04T10:00:00Z",
  "downloadUrl": null
}
```

Status values:
- `processing` - Job is being processed
- `completed` - Job completed successfully
- `failed` - Job failed with error

#### GET /api/batch/download/:jobId
Download results of batch processing job as CSV

**Response:** CSV file download with columns:
- ID
- Original Address
- Status
- Matched Office
- PIN Code
- District
- State
- DIGIPIN
- Confidence
- Latitude
- Longitude
- Error Message

#### DELETE /api/batch/:jobId
Delete a batch processing job

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3001
NODE_ENV=development
HOST=0.0.0.0

# API URLs
ML_API_URL=http://localhost:8000
DIGIPIN_API_URL=http://localhost:5000

# Data
CSV_PATH=../post/all_india_pincode_directory_2025.csv

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Batch Processing
BATCH_CHUNK_SIZE=10
BATCH_TIMEOUT_MS=300000
```

## Security Features

- ✅ **Helmet**: Security headers
- ✅ **CORS**: Cross-origin resource sharing
- ✅ **Rate Limiting**: Prevent abuse (100 req/15min per IP)
- ✅ **Input Validation**: Validate all inputs
- ✅ **Error Handling**: Sanitized error messages
- ✅ **File Upload Limits**: 10MB max file size
- ✅ **Compression**: Response compression

## Performance

- Single address matching: < 500ms
- PIN code lookup: < 50ms
- Batch processing: ~100 addresses/minute
- Memory usage: ~100MB (excluding dataset)
- Dataset load time: 2-5 seconds

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2025-11-04T..."
}
```

HTTP Status Codes:
- `200` - Success
- `202` - Accepted (async operations)
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable

## Development

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run lint
```

### Hot Reload Development
```bash
npm run dev
```

## Docker Support

### Build Image
```bash
docker build -t backend-api:latest .
```

### Run Container
```bash
docker run -d \
  -p 3001:3001 \
  -v $(pwd)/../post:/data:ro \
  -e CSV_PATH=/data/all_india_pincode_directory_2025.csv \
  -e ML_API_URL=http://ml-service:8000 \
  -e DIGIPIN_API_URL=http://digipin:5000 \
  --name backend-api \
  backend-api:latest
```

### Using Docker Compose
```bash
# From project root
docker-compose up backend
```

## Integration

### With Frontend
Frontend makes API calls to `http://localhost:3001`

### With ML Service
Backend proxies requests to ML service at `http://localhost:8000`

### With DIGIPIN Service
Backend calls DIGIPIN API at `http://localhost:5000` to encode coordinates

## Troubleshooting

### Data service not initializing
- Check CSV file path in `.env`
- Ensure CSV file exists and is readable
- Check console logs for errors

### ML service unavailable
- Verify ML service is running on port 8000
- Check `ML_API_URL` in `.env`
- Test with `curl http://localhost:8000/health`

### DIGIPIN service unavailable
- Verify DIGIPIN service is running on port 5000
- Check `DIGIPIN_API_URL` in `.env`
- Test with `curl http://localhost:5000/`

### Rate limit errors
- Increase `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Implement authentication to bypass rate limits
- Use batch endpoints for bulk operations

### Batch processing timeout
- Reduce `BATCH_CHUNK_SIZE` in `.env`
- Increase `BATCH_TIMEOUT_MS` in `.env`
- Process smaller batches

## Monitoring

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Service Status
Check individual service health in the health endpoint response

### Logs
All requests are logged with Morgan middleware in combined format

## Support

For issues or questions:
1. Check this README
2. Review error logs
3. Test individual services
4. Check integration with ML and DIGIPIN services

## License

Part of the AI-Powered Delivery Post Office Identification System hackathon project.

## Contributors

Department of Posts, Government of India
