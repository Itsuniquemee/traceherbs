# HerbalTrace Botanical Traceability System

This project provides end-to-end traceability for Ayurvedic herbs, including geo-tagged data capture, QR code labeling, RESTful APIs, and consumer-facing portals. Blockchain features are excluded in this version.

## Structure
- `backend/` - Java Spring Boot REST API, FHIR-style models, QR code generation, reporting
- `frontend/` - React web dashboard, mobile-friendly forms, consumer portal

## Setup Instructions

### Backend (Spring Boot)
1. Install Java 17+ and Maven.
2. Set up PostgreSQL and update `backend/src/main/resources/application.properties` with your DB credentials.
3. From `backend/`, run:
   ```sh
   mvn spring-boot:run
   ```
   This will auto-seed demo data for Ashwagandha.

### Frontend (React)
1. Install Node.js and npm.
2. From `frontend/`, run:
   ```sh
   npm install
   npm start
   ```
   The app runs at `http://localhost:3000`.

### API Endpoints
- `POST /api/collection` - Add collection event
- `GET /api/collection` - List collection events
- `POST /api/qualitytest` - Add quality test
- `GET /api/qualitytest` - List quality tests
- `POST /api/processingstep` - Add processing step
- `GET /api/processingstep` - List processing steps
- `GET /api/provenance/{batchId}` - Lookup provenance by batch/QR code

## QR Code Features
- Each batch can be assigned a unique QR code (generated in backend)
- Consumer portal allows lookup by QR code or batch ID
- For hackathon: Use the QR code libraries in backend (`zxing`) and frontend (`qrcode.react`) for generation and display

## Further Enhancements
- Add interactive maps (React Leaflet) for geo-tagged events
- Implement offline data entry and sync for mobile collectors
- Add authentication and role-based access (Spring Security)
- Extend FHIR-style models for richer metadata
- Add export/compliance reporting modules
- Simulate recall and notification flows
- Polish UI for hackathon demo (charts, maps, QR scan)

## Demo Data
- Ashwagandha collection, quality test, and processing step are auto-seeded
- View in dashboard and consumer portal

## Contact & Contribution
- Fork, extend, and contribute for hackathons or real-world pilots!
