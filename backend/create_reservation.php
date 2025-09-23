<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit(); }

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { http_response_code(400); echo json_encode(['error'=>'Invalid JSON data']); exit(); }

$required = ['team_name','team_number','email','time_slot'];
foreach ($required as $f) {
    if (!isset($input[$f]) || $input[$f]==='') { http_response_code(400); echo json_encode(['error'=>"Missing required field: $f"]); exit(); }
}
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) { http_response_code(400); echo json_encode(['error'=>'Invalid email format']); exit(); }

$team_number = (int)$input['team_number'];
if ($team_number < 1 || $team_number > 8) { http_response_code(400); echo json_encode(['error'=>'Participant count must be between 1 and 8']); exit(); }

$pdo = getDBConnection();
if (!$pdo) { http_response_code(500); echo json_encode(['error'=>'Database connection failed']); exit(); }

try {
    // Check for duplicate email
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE email = ?");
    $stmt->execute([$input['email']]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already exists', 'field' => 'email']);
        exit();
    }

    // Check for duplicate team name
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE team_name = ?");
    $stmt->execute([$input['team_name']]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Team name already exists', 'field' => 'team_name']);
        exit();
    }

    // Check for time slot availability
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE time_slot = ?");
    $stmt->execute([$input['time_slot']]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Time slot is already taken', 'field' => 'time_slot']);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO reservations (team_name, team_number, email, time_slot)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $input['team_name'],
        $team_number,
        $input['email'],
        $input['time_slot']
    ]);

    $reservationId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM reservations WHERE id = ?");
    $stmt->execute([$reservationId]);
    $reservation = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = [
        'reservation' => [
            'id'          => (int)$reservation['id'],
            'team_name'   => $reservation['team_name'],
            'team_number' => (int)$reservation['team_number'],
            'email'       => $reservation['email'],
            'time_slot'   => $reservation['time_slot'],
            'date'        => date('d.m.Y', strtotime($reservation['created_at'])),
            // 'status'    => 'active', // only if you add such a column
        ]
    ];

    http_response_code(201);
    echo json_encode($response);

} catch (PDOException $e) {
    error_log("Database error: ".$e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create reservation']);
}
