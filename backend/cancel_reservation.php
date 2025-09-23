<?php
require_once 'config.php';

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit(); }

// Input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['reservationId']) || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Reservation ID and email are required']);
    exit();
}

$reservationId = (int)$input['reservationId'];
$email = (string)$input['email'];
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// DB
$pdo = getDBConnection();
if (!$pdo) { http_response_code(500); echo json_encode(['error'=>'Database connection failed']); exit(); }

try {
    // 1) Find reservation by id + email
    $stmt = $pdo->prepare("
        SELECT id, team_name, team_number, email, time_slot, reg_date
        FROM reservations
        WHERE id = ? AND email = ?
    ");
    $stmt->execute([$reservationId, $email]);
    $reservation = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        http_response_code(404);
        echo json_encode(['error' => 'Reservation not found']);
        exit();
    }

    // 2) Cancel by deleting (no status column in schema)
    $del = $pdo->prepare("DELETE FROM reservations WHERE id = ?");
    $del->execute([$reservationId]);

    // 3) Response for UI
    $response = [
        'reservation' => [
            'id'               => (int)$reservation['id'],
            'teamName'         => $reservation['team_name'],
            'participantCount' => (int)$reservation['team_number'],
            'email'            => $reservation['email'],
            'time'             => $reservation['time_slot'],
            'timeDisplay'      => formatTimeDisplay($reservation['time_slot']),
            'date'             => date('d.m.Y', strtotime($reservation['reg_date'])),
            'status'           => 'cancelled', // logical status for the client
        ]
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    error_log("Database error: ".$e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to cancel reservation']);
}

// Helper
function formatTimeDisplay($time) {
    $startTime = $time;
    $endTime = date('H:i', strtotime($time . ' +10 minutes'));
    return "$startTime - $endTime";
}
