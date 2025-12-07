# Neighborhood Circle

A full-stack application for neighborhood services, utilizing WeChat Mini Program for frontend and Go (Gin) for backend.

## Structure

- `backend-gin/`: Go backend with Gin, GORM, PostgreSQL.
- `frontend-miniprogram/`: WeChat Mini Program frontend.

## Quick Start

### Backend

1. **Prerequisites**: Docker & Docker Compose.
2. **Run**:
   ```bash
   cd backend-gin
   docker-compose up --build
   ```
   The API will be available at `http://localhost:8080`.

### Frontend

1. **Prerequisites**: WeChat Developer Tools.
2. **Open**:
   - Open WeChat Developer Tools.
   - Import the `frontend-miniprogram` folder.
   - AppID: Use Test ID or your own.
3. **Run**:
   - The app uses **Mock Data** by default (configured in `utils/request.js`).
   - To connect to the real backend:
     - Ensure backend is running.
     - Edit `utils/request.js`, set `USE_MOCK = false`.
     - In WeChat IDE details, check "Does not verify valid domain names" (or configure local loopback).

## Features

- **User Auth**: WeChat Login (simulated) + JWT.
- **Task Management**: Post, view, and claim tasks.
- **Mock Mode**: Fully functional frontend without backend for UI testing.
