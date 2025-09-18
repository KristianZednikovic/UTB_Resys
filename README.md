# UTB Reservation System

A full-stack reservation system built with React frontend and Node.js backend for the UTB Strašidelná fakulta (Spooky Faculty) event.

## Features

- 🎃 Modern, responsive design with Halloween theme
- 📱 Mobile-friendly interface
- 🔄 Client-side routing with refresh support
- 📝 Reservation form with team registration
- ⏰ Time slot selection (10-minute intervals, 15:00-20:00)
- 👥 Maximum 8 participants per team
- 📧 Email-based reservation management
- 🗑️ Cancel existing reservations
- 🔍 View reservations by email
- 🎨 Beautiful gradient animations and effects

## Project Structure

```
UTB_Resys/
├── frontend/                 # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── server.js
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Quick Start

### Option 1: Production Mode (Recommended)

1. Install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd backend && npm install && cd ..

   # Install frontend dependencies
   cd frontend && npm install && cd ..
   ```

2. Build the frontend:

   ```bash
   cd frontend && npm run build && cd ..
   ```

3. Start the server:

   ```bash
   node start.js
   ```

   The application will be available at `http://localhost:5000`

### Option 2: Development Mode

1. **Backend Setup:**

   ```bash
   cd backend
   npm install
   npm run dev  # or node server.js
   ```

2. **Frontend Setup (in a new terminal):**

   ```bash
   cd frontend
   npm install
   npm start
   ```

   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## API Endpoints

- `GET /api` - API information
- `GET /api/health` - Health check endpoint
- `GET /api/reservations?email={email}` - Get reservations by email
- `POST /api/reservations` - Create a new reservation
- `PUT /api/reservations/:id/cancel` - Cancel a reservation
- `GET /*` - Serves the React application (handles client-side routing)

## Important Notes

### Client-Side Routing Fix

The application now properly handles client-side routing and page refreshes. When you refresh the page at `/reservations` or any other route, the server will serve the React application instead of returning a 404 error.

**How it works:**

1. The backend serves the built React app as static files
2. All non-API routes (`/*`) are handled by serving the `index.html` file
3. React Router takes over on the client side and displays the correct component

### Development vs Production

- **Development**: Frontend and backend run separately (ports 3000 and 5000)
- **Production**: Single server serves both API and frontend (port 5000 only)

## Technologies Used

### Frontend

- React 18
- React Router DOM
- Create React App
- Tailwind CSS
- Custom animations and gradients

### Backend

- Node.js
- Express.js
- CORS
- Helmet (security)
- Morgan (logging)
- dotenv (environment variables)
- Static file serving for SPA routing
