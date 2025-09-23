<?php
require_once 'config.php';

// Create database and table
function setupDatabase() {
    try {
        // Connect without database first
        $dsn = "mysql:host=" . DB_HOST . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        // Create database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
        $pdo->exec("USE " . DB_NAME);
        
        // Create reservations table
        $createTableSQL = "
            CREATE TABLE IF NOT EXISTS reservations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                team_name VARCHAR(255) NOT NULL,
                team_number INT NOT NULL CHECK (team_number >= 1 AND team_number <= 8),
                email VARCHAR(255) NOT NULL,
                time_slot VARCHAR(10) NOT NULL,
                status ENUM('active', 'cancelled') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_time_slot (time_slot),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        $pdo->exec($createTableSQL);
        
        echo "Database setup completed successfully!\n";
        echo "Database: " . DB_NAME . "\n";
        echo "Table: reservations\n";
        
        return true;
        
    } catch (PDOException $e) {
        echo "Database setup failed: " . $e->getMessage() . "\n";
        return false;
    }
}

// Run setup
if (php_sapi_name() === 'cli') {
    setupDatabase();
} else {
    // If accessed via web browser
    header('Content-Type: text/plain');
    setupDatabase();
}
?>
