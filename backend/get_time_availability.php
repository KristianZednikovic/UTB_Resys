<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200); 
    exit(); 
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') { 
    http_response_code(405); 
    echo json_encode(['error'=>'Method not allowed']); 
    exit(); 
}

$pdo = getDBConnection();
if (!$pdo) { 
    http_response_code(500); 
    echo json_encode(['error'=>'Database connection failed']); 
    exit(); 
}

try {
    // Get all time slots and their availability
    $stmt = $pdo->prepare("SELECT time_slot FROM reservations");
    $stmt->execute();
    $takenSlots = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Define all available time slots
    $allTimeSlots = [
        '15:00', '15:10', '15:20', '15:30', '15:40',
        '16:00', '16:10', '16:20', '16:30', '16:40',
        '17:00', '17:10', '17:20', '17:30', '17:40',
        '18:00', '18:10', '18:20', '18:30', '18:40',
        '19:00', '19:10', '19:20', '19:30', '19:40'
    ];
    
    $availability = [];
    foreach ($allTimeSlots as $slot) {
        $availability[$slot] = !in_array($slot, $takenSlots);
    }
    
    echo json_encode([
        'availability' => $availability,
        'taken_slots' => $takenSlots
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: ".$e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to get time availability']);
}
?>
