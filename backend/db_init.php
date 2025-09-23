<?php
$servername = "localhost";
$username = "mystery";
$password = "nGw9Y9Vpaa";
$dbname = "mystery";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// sql to create table
$sql = "CREATE TABLE reservations (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
team_name VARCHAR(50) NOT NULL,
team_number INT(6) NOT NULL,
email VARCHAR(50) NOT NULL,
time_slot VARCHAR(50) NOT NULL,
status VARCHAR(20) DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
  echo "Table reservations created successfully";
} else {
  echo "Error creating table: " . $conn->error;
}

$conn->close();
?>