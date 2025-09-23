<?php
echo "=== PHP Configuration Check ===\n\n";

echo "PHP Version: " . PHP_VERSION . "\n";
echo "PHP SAPI: " . PHP_SAPI . "\n\n";

echo "Available PDO Drivers:\n";
$drivers = PDO::getAvailableDrivers();
foreach ($drivers as $driver) {
    echo "  - $driver\n";
}
echo "\n";

echo "PDO MySQL Extension: " . (extension_loaded('pdo_mysql') ? "✅ Loaded" : "❌ Not Loaded") . "\n";
echo "MySQL Extension: " . (extension_loaded('mysql') ? "✅ Loaded" : "❌ Not Loaded") . "\n";
echo "MySQLi Extension: " . (extension_loaded('mysqli') ? "✅ Loaded" : "❌ Not Loaded") . "\n\n";

echo "PHP Configuration File: " . php_ini_loaded_file() . "\n";
echo "Additional INI files: " . (php_ini_scanned_files() ?: "None") . "\n\n";

echo "Extensions Directory: " . ini_get('extension_dir') . "\n\n";

if (!extension_loaded('pdo_mysql')) {
    echo "❌ PDO MySQL extension is not available.\n";
    echo "To fix this:\n";
    echo "1. Edit your php.ini file\n";
    echo "2. Find and uncomment: extension=pdo_mysql\n";
    echo "3. Restart your web server\n";
    echo "4. Or install PHP with MySQL support\n\n";
    
    echo "Common php.ini locations:\n";
    echo "- " . php_ini_loaded_file() . "\n";
    echo "- C:\\php8.4\\php.ini\n";
    echo "- C:\\Windows\\php.ini\n";
}
?>


