<?php
require_once 'config.php';
require_once 'admin_auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendErrorResponse('Method not allowed', 405);
}

// Verify admin authentication
verifyAdminAuth();

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendErrorResponse('Database connection failed', 500);
    }
    
    // Get all reservations with optional filters
    $timeSlot = $_GET['time_slot'] ?? '';
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $whereConditions = [];
    $params = [];
    
    if (!empty($timeSlot)) {
        $whereConditions[] = "time_slot = ?";
        $params[] = $timeSlot;
    }
    
    if (!empty($status)) {
        $whereConditions[] = "status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(team_name LIKE ? OR email LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Create separate WHERE clauses for each table since they have different column names
    $whereClause2 = '';
    $params2 = [];
    if (!empty($timeSlot)) {
        $whereClause2 .= ($whereClause2 ? ' AND ' : ' WHERE ') . "time_slot = ?";
        $params2[] = $timeSlot;
    }
    if (!empty($search)) {
        $whereClause2 .= ($whereClause2 ? ' AND ' : ' WHERE ') . "(team_name LIKE ? OR email LIKE ?)";
        $params2[] = "%$search%";
        $params2[] = "%$search%";
    }
    
    // Initialize empty arrays
    $reservations1 = [];
    $reservations2 = [];
    $stats1 = ['total_reservations' => 0, 'active_reservations' => 0, 'cancelled_reservations' => 0, 'unique_time_slots' => 0];
    $stats2 = ['total_reservations' => 0, 'active_reservations' => 0, 'cancelled_reservations' => 0, 'unique_time_slots' => 0];
    
    // Try to query reservations table
    try {
        $sql1 = "
            SELECT 
                id, team_name, team_number, email, time_slot, 
                'active' as status, reg_date as created_at, 
                reg_date as updated_at, 'reservations' as table_name
            FROM reservations 
            $whereClause
            ORDER BY reg_date DESC
        ";
        
        $stmt1 = $pdo->prepare($sql1);
        $stmt1->execute($params);
        $reservations1 = $stmt1->fetchAll();
        
        // Get stats for reservations table
        $statsSql1 = "
            SELECT 
                COUNT(*) as total_reservations,
                COUNT(*) as active_reservations,
                0 as cancelled_reservations,
                COUNT(DISTINCT time_slot) as unique_time_slots
            FROM reservations
        ";
        $stats1 = $pdo->query($statsSql1)->fetch();
    } catch (Exception $e) {
        error_log("Error querying reservations table: " . $e->getMessage());
        // Continue with empty results
    }
    
    // Try to query reservations_mira table
    try {
        $sql2 = "
            SELECT 
                id, team_name, team_number, email, time_slot, 
                'active' as status, reg_date as created_at, 
                reg_date as updated_at, 'reservations_mira' as table_name
            FROM reservations_mira 
            $whereClause2
            ORDER BY reg_date DESC
        ";
        
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->execute($params2);
        $reservations2 = $stmt2->fetchAll();
        
        // Get stats for reservations_mira table
        $statsSql2 = "
            SELECT 
                COUNT(*) as total_reservations,
                COUNT(*) as active_reservations,
                0 as cancelled_reservations,
                COUNT(DISTINCT time_slot) as unique_time_slots
            FROM reservations_mira
        ";
        $stats2 = $pdo->query($statsSql2)->fetch();
    } catch (Exception $e) {
        error_log("Error querying reservations_mira table: " . $e->getMessage());
        // Continue with empty results
    }
    
    // Combine results
    $reservations = array_merge($reservations1, $reservations2);
    
    // Sort by created_at
    usort($reservations, function($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });
    
    // Combine stats
    $stats = [
        'total_reservations' => ($stats1['total_reservations'] + $stats2['total_reservations']),
        'active_reservations' => ($stats1['active_reservations'] + $stats2['active_reservations']),
        'cancelled_reservations' => ($stats1['cancelled_reservations'] + $stats2['cancelled_reservations']),
        'unique_time_slots' => max($stats1['unique_time_slots'], $stats2['unique_time_slots'])
    ];
    
    sendJsonResponse([
        'reservations' => $reservations,
        'stats' => $stats
    ]);
    
} catch (Exception $e) {
    error_log("Admin reservations error: " . $e->getMessage());
    sendErrorResponse('Failed to fetch reservations', 500);
}
?>
