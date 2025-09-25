<?php
require_once 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
setCorsHeaders();

// Simple test endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    sendJsonResponse([
        'success' => true,
        'message' => 'Scanner test endpoint is working',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// Test POST endpoint - actually save to database
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    error_log("Test scanner request received: " . print_r($input, true));
    
    try {
        // Get database connection
        $pdo = getDBConnection();
        if (!$pdo) {
            error_log("Database connection failed in test");
            sendErrorResponse('Database connection failed', 500);
        }
        
        error_log("Database connection successful in test");
        
        // Create test data
        $testData = [
            'time_slot' => $input['test'] ?? 'Test_' . date('H:i:s'),
            'team_name' => 'Test_Team_' . date('Y-m-d_H-i-s'),
            'table' => 1
        ];
        
        error_log("Test data: " . print_r($testData, true));
        
        // Check if record already exists
        $checkSql = "SELECT COUNT(*) FROM scanned WHERE time_slot = :time_slot AND team_name = :team_name AND `table` = :table";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->bindParam(':time_slot', $testData['time_slot']);
        $checkStmt->bindParam(':team_name', $testData['team_name']);
        $checkStmt->bindParam(':table', $testData['table']);
        $checkStmt->execute();
        
        $existingCount = $checkStmt->fetchColumn();
        error_log("Test - Existing records count: " . $existingCount);
        
        if ($existingCount > 0) {
            error_log("Test - Record already exists, skipping insert");
            echo json_encode(['success' => true, 'message' => 'Record already exists, not saved']);
            return;
        }
        
        // Prepare SQL statement - escape 'table' as it's a reserved keyword
        $sql = "INSERT INTO scanned (time_slot, team_name, `table`) VALUES (:time_slot, :team_name, :table)";
        error_log("Test SQL: " . $sql);
        
        $stmt = $pdo->prepare($sql);
        
        // Bind parameters
        $stmt->bindParam(':time_slot', $testData['time_slot']);
        $stmt->bindParam(':team_name', $testData['team_name']);
        $stmt->bindParam(':table', $testData['table']);
        
        error_log("Test parameters bound");
        
        // Execute the statement
        $result = $stmt->execute();
        error_log("Test execute result: " . ($result ? 'true' : 'false'));
        
        if ($result) {
            error_log("Test data saved successfully");
            sendJsonResponse([
                'success' => true,
                'message' => 'Scanner POST test successful - data saved to database',
                'received_data' => $input,
                'saved_data' => $testData,
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } else {
            error_log("Test data save failed");
            sendErrorResponse('Failed to save test data', 500);
        }
        
    } catch (PDOException $e) {
        error_log("Test database error: " . $e->getMessage());
        sendErrorResponse('Test database error: ' . $e->getMessage(), 500);
    } catch (Exception $e) {
        error_log("Test general error: " . $e->getMessage());
        sendErrorResponse('Test server error: ' . $e->getMessage(), 500);
    }
}
?>
