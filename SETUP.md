# Nexus Portal - Setup Guide

## ✅ Implementation Complete

The full-stack application has been implemented with all required features:

### Backend Features
- ✅ Express.js API with in-memory storage
- ✅ Exact state machine transitions (8 states)
- ✅ Critical ticket lock (one per master)
- ✅ Job request requirement for Monitoring
- ✅ Complete audit logging
- ✅ All required API endpoints

### Frontend Features
- ✅ React + TypeScript + Vite
- ✅ Dashboard with real-time updates
- ✅ Create ticket page with master/tool selection
- ✅ Ticket detail page with state transitions
- ✅ Job request editing (Waiting state only)
- ✅ Audit log viewer
- ✅ Critical warning banner
- ✅ Live data updates (5-second polling + window focus)

## 🚀 Running the Application

### Step 1: Start the Backend

```bash
cd backend
npm install  # Already done
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Start the Frontend

```bash
# In the root directory
npm install  # If not already done
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 3: Access the Application

1. Open `http://localhost:5173` in your browser
2. Login with: `admin@nexus.com` / `admin`
3. Start creating and managing tickets!

## 📋 State Machine Rules

**Valid Transitions:**
- Waiting → Monitoring (requires jobRequest)
- Monitoring → Ready
- Monitoring → Hold
- Hold → Monitoring
- Ready → Critical (only if no other Critical for same master)
- Critical → Complete
- Critical → Failed
- Complete → Closed
- Failed → Closed

## 🔌 API Endpoints

### Masters
- `GET /api/masters` - Get all masters

### Tools
- `GET /api/tools` - Get all tools

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
  ```json
  {
    "masterId": "master-1",
    "toolId": "tool-1"
  }
  ```
- `POST /api/tickets/:id/job-request` - Add/update job request
  ```json
  {
    "jobRequest": "Diagnose engine error P0300"
  }
  ```
- `POST /api/tickets/:id/transition` - Transition state
  ```json
  {
    "toState": "Monitoring"
  }
  ```
- `GET /api/tickets/:id/logs` - Get audit logs

## 🎯 User Journey

1. **Create Ticket**: Select master and tool → Ticket created in Waiting state
2. **Add Job Request**: Edit job request (only in Waiting state)
3. **Start Monitoring**: Transition to Monitoring (requires job request)
4. **Continue Transitions**: Move through states following the state machine
5. **View History**: Check audit logs for complete history

## 🛠️ Technical Stack

**Backend:**
- Node.js + Express
- In-memory JavaScript storage
- CORS enabled

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query (data fetching)
- Zustand (state management)
- React Router (routing)

## 📝 Notes

- All data is stored in-memory and will reset on backend restart
- Real-time updates via 5-second polling + window focus refetch
- Error messages from backend are displayed to users
- Critical tickets show warning banner
- One master can only have one critical ticket at a time
