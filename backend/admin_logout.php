<?php
require_once 'config.php';
require_once 'admin_auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Method not allowed', 405);
}

// Clear admin session
clearAdminSession();

sendJsonResponse([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>
