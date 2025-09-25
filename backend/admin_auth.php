<?php
require_once 'config.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Admin authentication middleware
function verifyAdminAuth() {
    // Check if admin is logged in via session
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        sendErrorResponse('Authentication required. Please log in.', 401);
    }
    
    // Check if admin email is set in session
    if (!isset($_SESSION['admin_email'])) {
        sendErrorResponse('Invalid session. Please log in again.', 401);
    }
    
    // Verify the admin still exists in database
    try {
        $pdo = getDBConnection();
        if (!$pdo) {
            sendErrorResponse('Database connection failed', 500);
        }
        
        $stmt = $pdo->prepare("SELECT email FROM admin WHERE email = ?");
        $stmt->execute([$_SESSION['admin_email']]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            // Admin no longer exists, clear session
            session_destroy();
            sendErrorResponse('Admin account not found. Please log in again.', 401);
        }
        
        return $admin;
        
    } catch (Exception $e) {
        error_log("Admin auth error: " . $e->getMessage());
        sendErrorResponse('Authentication failed', 500);
    }
}

// Function to set admin session after successful login
function setAdminSession($email) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_email'] = $email;
}

// Function to clear admin session
function clearAdminSession() {
    $_SESSION['admin_logged_in'] = false;
    unset($_SESSION['admin_email']);
    session_destroy();
}
?>
