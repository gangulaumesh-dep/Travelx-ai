# TRAVELX

TRAVELX is a full-stack travel discovery and trip-planning application.

## Stack
- React + Vite frontend
- Express.js backend
- PostgreSQL database
- JWT authentication

## Architecture
React UI → `frontend/src/api.js` → Express REST API → PostgreSQL

## Main modules
- Authentication and role-based access
- Tourist discoveries
- AI trip planner
- Live trip itinerary and budget tracking
- Guide and business profiles
- Authority verification and insights

## Local development
### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Configure the backend and frontend `.env` files from their `.env.example` files before running the application.
