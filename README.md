# UTB Reservation System

A full-stack reservation system built with React frontend and Node.js backend.

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

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check endpoint

## Development

- Backend runs on port 5000
- Frontend runs on port 3000 and proxies API requests to the backend
- Use `npm run dev` in the backend for development with auto-restart
- Use `npm start` in the frontend for development with hot-reload

## Technologies Used

### Frontend

- React 18
- Create React App
- CSS3

### Backend

- Node.js
- Express.js
- CORS
- Helmet (security)
- Morgan (logging)
- dotenv (environment variables)
