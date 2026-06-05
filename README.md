# HerbalTrace Botanical Traceability System

End-to-end traceability for Ayurvedic herbs, including geo-tagged data capture, QR code labeling, RESTful APIs, and consumer-facing portals. This repository ships a Node.js/Express backend with MongoDB and a React frontend. It also exposes FHIR-style provenance bundles and geo-tagged collection events.

## Structure
- `backend/` - Node.js/Express API (MongoDB), FHIR-style bundle export, QR generation, reporting
- `frontend/` - React web dashboard, mobile-friendly forms, consumer portal with QR scan and interactive maps

## Quick Start

### Backend (Node.js + MongoDB)
1. Install Node.js and npm
2. Ensure MongoDB is running locally
3. Copy env: `cp backend/.env.example backend/.env` and set JWT_SECRET, MONGODB_URI, etc.
4. From `backend/`:
   ```sh
   npm install
   npm run dev
   ```
   API will start at `http://localhost:3001`.

### Frontend (React)
1. From `frontend/`:
   ```sh
   npm install
   npm start
   ```
   The app runs at `http://localhost:3000`.

### Key APIs
- `GET /api/health` – health status
- `POST /api/collection` – record geo-tagged collection event
- `GET /api/collection?batchId=...` – list collection events
- `GET /api/trace/:batchId` – full trace view with geo path
- `GET /api/fhir/bundle/:batchId` – FHIR-style provenance bundle for the batch

## QR Code
- Backend generates minimal QR payloads that deep link to `/trace/:id`
- Frontend uses an optimized QR service; TraceViewer fetches from backend when available and falls back to local storage for demo traces

## Enhancements Included
- Interactive maps (React Leaflet) for geo-tagged journeys
- FHIR-style bundle export for provenance and audit
- Role-based endpoints, rate limiting, Helmet, validation
- Docs and full integration server entrypoint

## Contributing
- Fork and open PRs for new features (Hyperledger integration stubs included under `backend/services/ledger.js`)
