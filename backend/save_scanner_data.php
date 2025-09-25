<?php
require_once 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log the request
error_log("Scanner data request received: " . $_SERVER['REQUEST_METHOD']);

// Set CORS headers
setCorsHeaders();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Method not allowed: " . $_SERVER['REQUEST_METHOD']);
    sendErrorResponse('Method not allowed', 405);
}

// Get JSON input
$rawInput = file_get_contents('php://input');
error_log("Raw input: " . $rawInput);

$input = json_decode($rawInput, true);
error_log("Parsed input: " . print_r($input, true));

if (!$input) {
    error_log("Invalid JSON input");
    sendErrorResponse('Invalid JSON input');
}

// Log each field individually
error_log("time_slot: " . (isset($input['time_slot']) ? $input['time_slot'] : 'NOT SET'));
error_log("team_name: " . (isset($input['team_name']) ? $input['team_name'] : 'NOT SET'));
error_log("table: " . (isset($input['table']) ? $input['table'] : 'NOT SET'));

// Validate required fields
$required_fields = ['time_slot', 'team_name', 'table'];
foreach ($required_fields as $field) {
    if (!isset($input[$field])) {
        sendErrorResponse("Missing required field: $field");
    }
}

try {
    error_log("Attempting database connection...");
    
    // Get database connection
    $pdo = getDBConnection();
    if (!$pdo) {
        error_log("Database connection failed");
        sendErrorResponse('Database connection failed', 500);
    }
    
    error_log("Database connection successful");

    // Check if record already exists
    $checkSql = "SELECT COUNT(*) FROM scanned WHERE time_slot = :time_slot AND team_name = :team_name AND `table` = :table";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->bindParam(':time_slot', $input['time_slot']);
    $checkStmt->bindParam(':team_name', $input['team_name']);
    $checkStmt->bindParam(':table', $input['table']);
    $checkStmt->execute();
    
    $existingCount = $checkStmt->fetchColumn();
    error_log("Existing records count: " . $existingCount);
    
    if ($existingCount > 0) {
        error_log("Record already exists, skipping insert");
        sendSuccessResponse('Record already exists, not saved');
        return;
    }

    // Prepare SQL statement - escape 'table' as it's a reserved keyword
    $sql = "INSERT INTO scanned (time_slot, team_name, `table`) VALUES (:time_slot, :team_name, :table)";
    error_log("SQL: " . $sql);
    
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':time_slot', $input['time_slot']);
    $stmt->bindParam(':team_name', $input['team_name']);
    $stmt->bindParam(':table', $input['table']);
    
    error_log("Parameters bound: time_slot=" . $input['time_slot'] . ", team_name=" . $input['team_name'] . ", table=" . $input['table']);

    // Execute the statement
    $result = $stmt->execute();
    error_log("Execute result: " . ($result ? 'true' : 'false'));
    
    if ($result) {
        error_log("Data saved successfully");
    } else {
        error_log("Failed to save data");
    }

    // Return success response
    sendJsonResponse([
        'success' => true,
        'message' => 'Scanner data saved successfully',
        'data' => [
            'time_slot' => $input['time_slot'],
            'team_name' => $input['team_name'],
            'table' => $input['table']
        ]
    ]);

} catch (PDOException $e) {
    // Log the error
    error_log("Database error: " . $e->getMessage());
    sendErrorResponse('Database error occurred', 500);
} catch (Exception $e) {
    // Log the error
    error_log("General error: " . $e->getMessage());
    sendErrorResponse('Server error occurred', 500);
}
?>
