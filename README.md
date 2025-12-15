# Nexus Portal - Full Stack Application

Complete ticket management system with state machine, critical lock, and audit logging.

## Architecture

- **Backend**: Express.js with in-memory storage
- **Frontend**: React + TypeScript + Vite
- **State Management**: Zustand + React Query

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

✅ Complete ticket lifecycle management
✅ State machine with exact transition rules
✅ Critical ticket lock (one per master)
✅ Job request requirement for Monitoring
✅ Full audit logging
✅ Real-time updates (5-second polling)
✅ Responsive UI with Tailwind CSS

## State Transitions

- **Waiting** → Monitoring (requires jobRequest)
- **Monitoring** → Ready | Hold
- **Hold** → Monitoring
- **Ready** → Critical
- **Critical** → Complete | Failed
- **Complete** → Closed
- **Failed** → Closed

## API Endpoints

See `backend/README.md` for complete API documentation.
