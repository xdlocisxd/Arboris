# Project Shutdown Plan - FloraTrack

## 📋 Overview
Coordinate the clean shutdown of all project services (Database, Backend, Frontend).

## 🔄 Shutdown Sequence

### Phase 1: Application Services
- [x] Task 1: Stop Frontend process (Vite).
- [x] Task 2: Stop Backend process (Express/Node).
- [x] Task 3: Verify processes are terminated.

### Phase 2: Infrastructure
- [x] Task 1: Stop and remove Docker containers (`docker-compose down`).
- [x] Task 2: Verify database is closed.

## ✅ Success Criteria
- [x] Port 3000 (Backend) is free.
- [x] Port 5173 (Frontend) is free.
- [x] Docker container `floratrack_postgis` is stopped/removed.
