<?php
require_once 'config.php';

// Set CORS headers
setCorsHeaders();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendErrorResponse('Invalid JSON input');
}

// Validate required fields
if (!isset($input['reservationId']) || !isset($input['newTimeSlot'])) {
    sendErrorResponse('Missing required fields: reservationId and newTimeSlot');
}

$reservationId = $input['reservationId'];
$newTimeSlot = $input['newTimeSlot'];

// Validate time slot format
if (!preg_match('/^\d{2}:\d{2}$/', $newTimeSlot)) {
    sendErrorResponse('Invalid time slot format. Use HH:MM format');
}

// Get database connection
$pdo = getDBConnection();
if (!$pdo) {
    sendErrorResponse('Database connection failed', 500);
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if the new time slot is available
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE time_slot = ? AND id != ?");
    $checkStmt->execute([$newTimeSlot, $reservationId]);
    $isSlotTaken = $checkStmt->fetchColumn() > 0;
    
    if ($isSlotTaken) {
        $pdo->rollBack();
        sendErrorResponse('Time slot is already taken');
    }
    
    // Get current reservation details
    $getStmt = $pdo->prepare("SELECT * FROM reservations WHERE id = ?");
    $getStmt->execute([$reservationId]);
    $reservation = $getStmt->fetch();
    
    if (!$reservation) {
        $pdo->rollBack();
        sendErrorResponse('Reservation not found');
    }
    
    // Update the time slot
    $updateStmt = $pdo->prepare("UPDATE reservations SET time_slot = ? WHERE id = ?");
    $result = $updateStmt->execute([$newTimeSlot, $reservationId]);
    
    if (!$result) {
        $pdo->rollBack();
        sendErrorResponse('Failed to update time slot');
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Return success response
    sendJsonResponse([
        'success' => true,
        'message' => 'Time slot updated successfully',
        'reservation' => [
            'id' => $reservationId,
            'old_time_slot' => $reservation['time_slot'],
            'new_time_slot' => $newTimeSlot,
            'team_name' => $reservation['team_name'],
            'email' => $reservation['email']
        ]
    ]);
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error in time_change.php: " . $e->getMessage());
    sendErrorResponse('Database error occurred', 500);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Error in time_change.php: " . $e->getMessage());
    sendErrorResponse('An error occurred while updating the time slot', 500);
}
?>
