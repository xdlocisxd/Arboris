# Project Startup Plan - FloraTrack

## 📋 Overview
Coordinate the startup of the multi-service FloraTrack project (Database, Backend, Frontend).

## 🛠️ Tech Stack
- **Database**: PostGIS (Docker Compose)
- **Backend**: Express/Prisma (Port 3000)
- **Frontend**: React/Vite (Port 5173 - default)

## 🔄 Startup Sequence

### Phase 1: Infrastructure (DevOps)
- [x] Task 1: Check Docker availability.
- [x] Task 2: Start PostGIS container (`docker-compose up -d`).
- [x] Task 3: Verify container health.

### Phase 2: Services (Backend & Frontend)
- [x] Task 1: Start backend in background (`cd backend && npm run dev`).
- [x] Task 2: Wait for backend readiness on port 3000.
- [x] Task 3: Start frontend in background (`cd frontend && npm run dev`).

## ✅ Success Criteria
- [x] Docker container `floratrack_postgis` is running.
- [x] Backend is accessible at `http://localhost:3000`.
- [x] Frontend is accessible at `http://localhost:5173`.
- [x] Project logs are being captured.
