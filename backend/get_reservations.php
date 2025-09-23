<?php
require_once 'config.php';

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit(); }

$email = $_GET['email'] ?? '';
if ($email === '') { http_response_code(400); echo json_encode(['error'=>'Email parameter is required']); exit(); }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(400); echo json_encode(['error'=>'Invalid email format']); exit(); }

$pdo = getDBConnection();
if (!$pdo) { http_response_code(500); echo json_encode(['error'=>'Database connection failed']); exit(); }

try {
    // Only use columns that exist in your schema
    $stmt = $pdo->prepare("
        SELECT id, team_name, team_number, email, time_slot, created_at
        FROM reservations
        WHERE email = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$email]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format output while keeping your frontend keys
    $formattedReservations = array_map(function($r) {
        return [
            'id'               => (int)$r['id'],
            'teamName'         => $r['team_name'],
            'participantCount' => (int)$r['team_number'],     // was participant_count
            'email'            => $r['email'],
            'time'             => $r['time_slot'],            // was time
            'timeDisplay'      => formatTimeDisplay($r['time_slot']),
            'date'             => date('d.m.Y', strtotime($r['created_at'])),
            'status'           => 'active',                    // table has no status; return a sensible constant if your UI expects it
        ];
    }, $reservations);

    echo json_encode([
        'reservations' => $formattedReservations,
        'count'        => count($formattedReservations),
    ]);

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch reservations']);
}

// Helper: "HH:MM" -> "HH:MM - HH:MM+10min"
function formatTimeDisplay($time)
{
    $startTime = $time;
    $endTime = date('H:i', strtotime($time . ' +10 minutes'));
    return "$startTime - $endTime";
}
