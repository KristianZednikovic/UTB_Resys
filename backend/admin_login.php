<?php
require_once 'config.php';
require_once 'admin_auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    sendErrorResponse('Email and password are required', 400);
}

$email = trim($input['email']);
$password = $input['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendErrorResponse('Invalid email format', 400);
}

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendErrorResponse('Database connection failed', 500);
    }
    
    // Find admin user
    $stmt = $pdo->prepare("SELECT email, pass FROM admin WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        sendErrorResponse('Invalid credentials', 401);
    }
    
    // Verify password (assuming it's stored as plain text in varchar(32))
    if ($password !== $admin['pass']) {
        sendErrorResponse('Invalid credentials', 401);
    }
    
    // Set admin session
    setAdminSession($admin['email']);
    
    sendJsonResponse([
        'success' => true,
        'admin' => [
            'email' => $admin['email']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Admin login error: " . $e->getMessage());
    sendErrorResponse('Login failed', 500);
}
?>
