# Backend PHP Files

This directory contains standalone PHP files for the UTB Reservations system.

## Files

- **`config.php`** - Database configuration and utility functions
- **`create_reservation.php`** - Creates new reservations
- **`get_reservations.php`** - Retrieves reservations by email
- **`cancel_reservation.php`** - Cancels existing reservations
- **`setup.php`** - Database initialization script
- **`.env`** - Environment variables (database credentials)

## Usage

These files are designed to work as standalone PHP scripts that can be called directly by the React frontend without requiring a running backend server.

## Deployment

Use the deployment script in the root directory to copy these files to your React build:

```bash
php deploy.php
```

This will copy all necessary PHP files to `frontend/build/backend/` for deployment.
