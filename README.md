# Nexus Portal - Ticket Management System

## 📋 Project Overview

Nexus Portal is a full-stack ticket management system designed to track and manage service tickets through a well-defined state machine workflow. The application provides a modern, responsive interface for creating tickets, managing their lifecycle, and maintaining comprehensive audit logs.

### Key Capabilities

- **Ticket Lifecycle Management**: Complete workflow from creation to closure
- **State Machine Enforcement**: Strict state transition rules ensure data integrity
- **Critical Ticket Lock**: Prevents multiple critical tickets per master simultaneously
- **Real-time Updates**: Live data synchronization with automatic polling
- **Comprehensive Audit Logging**: Complete history of all ticket actions and state changes
- **User-Friendly Interface**: Modern, responsive UI with dark mode support

---

## 🏗️ Architecture

Nexus Portal follows a modern full-stack architecture:

```
┌─────────────────┐
│   Frontend      │  React + TypeScript + Vite
│   (Port 5173)   │  Tailwind CSS + Radix UI
└────────┬────────┘
         │ HTTP/REST API
┌────────▼────────┐
│   Backend       │  Express.js + Node.js
│   (Port 5000)   │  In-memory storage
└─────────────────┘
```

### Technology Stack

**Frontend:**
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management and data fetching
- **Zustand** - Client state management
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations

**Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd nexus-portal
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

#### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

#### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### 5. Start the Frontend Development Server

In a new terminal window:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

#### 6. Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Login with the default credentials:
   - **Email**: `admin@nexus.com`
   - **Password**: `admin`

---

## 📖 User Guide

### Creating a Ticket

1. Navigate to the **Create Ticket** page from the sidebar
2. Select a **Master** (e.g., "Zeus" or "Phoenix")
3. Select a **Tool** associated with the selected master
4. Optionally add a **Job Request** description
5. Click **Create Ticket**

The ticket will be created in the **Waiting** state.

### Managing Ticket States

Tickets progress through a defined state machine. To transition a ticket:

1. Navigate to the **Tickets** page or click on a ticket from the dashboard
2. Open the ticket detail page
3. Use the **State Transition** buttons to move the ticket to the next valid state
4. The system will enforce valid transitions and display error messages for invalid attempts

### Editing Job Requests

- Job requests can only be edited when a ticket is in the **Waiting** state
- Navigate to the ticket detail page and click **Edit Job Request**
- This field is required before transitioning to **Monitoring** state

### Viewing Audit Logs

Every ticket action is logged. To view the complete history:

1. Open any ticket detail page
2. Scroll to the **Audit Log** section
3. View all actions, state changes, and timestamps

### Critical Ticket Warning

When a ticket enters the **Critical** state:
- A warning banner appears at the top of the application
- Only one critical ticket per master is allowed
- The system prevents creating additional critical tickets for the same master

---

## 🔄 State Machine

The ticket lifecycle follows a strict state machine with the following states and transitions:

### States

1. **Waiting** - Initial state when ticket is created
2. **Monitoring** - Ticket is being actively monitored
3. **Hold** - Ticket is temporarily paused
4. **Ready** - Ticket is ready for critical processing
5. **Critical** - Ticket requires immediate attention
6. **Complete** - Ticket was successfully completed
7. **Failed** - Ticket processing failed
8. **Closed** - Final state (terminal)

### Valid Transitions

```
Waiting → Monitoring (requires jobRequest)
Monitoring → Ready
Monitoring → Hold
Hold → Monitoring
Ready → Critical (only if no other Critical for same master)
Critical → Complete
Critical → Failed
Complete → Closed
Failed → Closed
```

### State Transition Rules

- **Waiting → Monitoring**: Requires a `jobRequest` to be set
- **Ready → Critical**: Only allowed if no other ticket for the same master is in Critical state
- **Complete/Failed → Closed**: Terminal transitions (no further changes allowed)
- All other transitions follow the state machine diagram above

---

## 🔌 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Masters

**Get All Masters**
```
GET /api/masters
```

**Response:**
```json
[
  {
    "id": "master-1",
    "name": "Zeus",
    "description": "Primary diagnostics master"
  }
]
```

#### Tools

**Get All Tools**
```
GET /api/tools
```

**Response:**
```json
[
  {
    "id": "tool-1",
    "name": "Diagnostic Scanner A",
    "masterId": "master-1"
  }
]
```

#### Tickets

**Get All Tickets**
```
GET /api/tickets
```

**Get Single Ticket**
```
GET /api/tickets/:id
```

**Create Ticket**
```
POST /api/tickets
Content-Type: application/json

{
  "masterId": "master-1",
  "toolId": "tool-1"
}
```

**Add/Update Job Request**
```
POST /api/tickets/:id/job-request
Content-Type: application/json

{
  "jobRequest": "Diagnose engine error P0300"
}
```

**Transition Ticket State**
```
POST /api/tickets/:id/transition
Content-Type: application/json

{
  "toState": "Monitoring"
}
```

**Get Audit Logs**
```
GET /api/tickets/:id/logs
```

**Response:**
```json
[
  {
    "id": "log-1",
    "ticketId": "ticket-1",
    "action": "STATE_TRANSITION",
    "user": "admin@nexus.com",
    "timestamp": "2024-01-15T10:30:00Z",
    "details": "State changed from Waiting to Monitoring"
  }
]
```

### Error Responses

All endpoints return standard HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `409` - Conflict (e.g., invalid state transition)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

---

## 📁 Project Structure

```
nexus-portal/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (state machine, ticket service)
│   │   ├── data.js          # In-memory data store
│   │   └── server.js        # Express server setup
│   ├── package.json
│   └── README.md
│
├── src/                     # Frontend application
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (buttons, cards, etc.)
│   │   ├── TicketCard.tsx
│   │   ├── TicketDetailPage.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── CreateTicketPage.tsx
│   │   ├── TicketsPage.tsx
│   │   └── ...
│   ├── services/           # API service layer
│   │   └── api.ts
│   ├── store/              # State management (Zustand)
│   │   ├── auth.ts
│   │   └── theme.ts
│   ├── types/              # TypeScript type definitions
│   │   └── ticket.ts
│   ├── styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
│
├── dist/                   # Production build output
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

---

## 🎨 Features

### Core Features

✅ **Ticket Management**
- Create tickets with master and tool selection
- View all tickets in a dashboard
- Detailed ticket view with full information
- Real-time ticket status updates

✅ **State Machine**
- Enforced state transitions
- Visual state indicators
- Transition validation with error messages
- State-specific actions (e.g., job request editing)

✅ **Critical Ticket Management**
- One critical ticket per master limit
- Visual warning banner for critical tickets
- Automatic validation on state transitions

✅ **Audit Logging**
- Complete action history
- Timestamp tracking
- User action logging
- Detailed change descriptions

✅ **Real-time Updates**
- Automatic polling every 5 seconds
- Window focus refetch
- Live status updates across all pages

### UI/UX Features

✅ **Modern Interface**
- Clean, professional design
- Responsive layout (mobile-friendly)
- Dark mode support
- Smooth animations and transitions

✅ **User Experience**
- Intuitive navigation
- Clear error messages
- Loading states and skeletons
- Toast notifications for actions

✅ **Accessibility**
- Keyboard navigation support
- Screen reader friendly (Radix UI)
- High contrast modes
- Focus management

---

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev      # Start with auto-reload (watch mode)
npm start        # Start production server
```

### Building for Production

**Frontend:**
```bash
npm run build
```

The production build will be in the `dist/` directory.

**Backend:**
```bash
cd backend
npm start
```

### Environment Variables

Currently, the application uses default ports:
- Frontend: `5173`
- Backend: `5000`

To change the backend port, set the `PORT` environment variable:
```bash
PORT=3000 npm run dev
```

---

## 📝 Data Storage

**Important:** The current implementation uses **in-memory storage**. This means:

- All data (tickets, masters, tools, audit logs) is stored in memory
- Data is **lost when the server restarts**
- This is suitable for development and demonstration purposes

For production use, you would need to:
1. Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. Implement proper data persistence
3. Add database migrations and seed scripts

---

## 🔐 Authentication

The application includes a basic authentication system:

- **Default Credentials:**
  - Email: `admin@nexus.com`
  - Password: `admin`

- **Authentication State:**
  - Stored in browser localStorage
  - Persists across page refreshes
  - Protected routes require authentication

**Note:** For production, implement:
- Secure password hashing
- JWT tokens or session management
- User management system
- Role-based access control

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check that all dependencies are installed (`npm install` in backend folder)
- Verify Node.js version (v18+)

### Frontend won't start
- Ensure port 5173 is not in use
- Check that all dependencies are installed (`npm install` in root)
- Clear `node_modules` and reinstall if needed

### API calls failing
- Verify backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Ensure backend CORS is properly configured

### State transitions not working
- Verify job request is set (for Waiting → Monitoring)
- Check that no other critical ticket exists for the same master
- Review state machine rules in this README

---

## 📚 Additional Resources

- **Backend API Documentation**: See `backend/README.md`
- **Setup Guide**: See `SETUP.md`
- **State Machine Rules**: See "State Machine" section above

---

## 🤝 Support

For questions, issues, or feature requests, please contact the development team.

---

## 📄 License

[Add your license information here]

---

## 🎯 Future Enhancements

Potential improvements for future versions:

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User management and roles
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Export functionality (CSV/PDF)
- [ ] Dashboard analytics and charts
- [ ] Mobile app
- [ ] API authentication (JWT)
- [ ] WebSocket support for real-time updates
- [ ] File attachments for tickets

---

**Version:** 1.0.0  
**Last Updated:** 2024
