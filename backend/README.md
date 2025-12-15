# Nexus Portal Backend

Express.js backend with in-memory storage for the Nexus Portal application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Masters
- `GET /api/masters` - Get all masters

### Tools
- `GET /api/tools` - Get all tools

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket (requires `masterId` and `toolId`)
- `POST /api/tickets/:id/job-request` - Add/update job request
- `POST /api/tickets/:id/transition` - Transition ticket state (requires `toState`)
- `GET /api/tickets/:id/logs` - Get audit logs for ticket

## State Machine

Valid transitions:
- Waiting → Monitoring (requires jobRequest)
- Monitoring → Ready
- Monitoring → Hold
- Hold → Monitoring
- Ready → Critical (only if no other Critical for same master)
- Critical → Complete
- Critical → Failed
- Complete → Closed
- Failed → Closed

## Data Structure

All data is stored in-memory and will be reset when the server restarts.
