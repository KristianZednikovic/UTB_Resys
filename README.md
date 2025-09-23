# UTB Reservation System

A full-stack reservation system built with React frontend and PHP backend for the UTB Strašidelná fakulta event.

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
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.js
│   │   │   ├── ReservationPage.js
│   │   │   └── ManageReservation.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/                  # PHP backend files
│   ├── config.php
│   ├── create_reservation.php
│   ├── get_reservations.php
│   ├── cancel_reservation.php
│   ├── setup.php
│   └── .env
└── README.md
```

## Quick Start

### Development

1. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. **Backend Setup:**
   - Update `backend/.env` with your database credentials
   - Run `php backend/db_init.php` to initialize database
   - Or use `backend/run_db_init.bat` on Windows

### Deployment

1. **Build React App:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copy PHP Files:**
   ```bash
   # Copy backend folder to build directory
   cp -r backend frontend/build/
   ```

3. **Upload to Web Server:**
   - Upload the entire `frontend/build` folder to your web server
   - Ensure your web server supports PHP and MySQL
   - Visit `yoursite.com/backend/db_init.php` to initialize database

## Requirements

- **Frontend**: Node.js (v14+), npm
- **Backend**: PHP 7.4+, MySQL 5.7+
- **Web Server**: Apache/Nginx with PHP support

## API Endpoints

- `POST ./backend/create_reservation.php` - Create reservation
- `GET ./backend/get_reservations.php?email=user@example.com` - Get reservations
- `POST ./backend/cancel_reservation.php` - Cancel reservation

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Create React App

### Backend
- PHP 7.4+
- MySQL
- PDO for database operations
- Standalone PHP files (no server required)
