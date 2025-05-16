<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173"); // Sesuaikan dengan URL frontend
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

require_once "../config/database.php"; // Pastikan ini file koneksi ke database

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Harap isi username dan password!"]);
    exit;
}

$username = $data["username"];
$password = $data["password"];

$stmt = $conn->prepare("SELECT * FROM admin WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user["password"])) {
        $_SESSION["user"] = $user["username"];
        
        echo json_encode(["success" => true, "message" => "Login berhasil!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Password salah!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Username tidak ditemukan!"]);
}

$stmt->close();
$conn->close();
?>
