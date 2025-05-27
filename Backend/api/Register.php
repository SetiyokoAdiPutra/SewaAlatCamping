<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Username dan password wajib diisi!"]);
    exit;
}

$username = trim($data["username"]);
$password = $data["password"];

// Cek apakah username sudah ada
$stmt = $conn->prepare("SELECT id_admin FROM admin WHERE username = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Query gagal: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username sudah terdaftar!"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Simpan user baru
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO admin (username, password) VALUES (?, ?)");
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Query insert gagal: " . $conn->error
    ]);
    exit;
}

// Debug untuk memastikan dua parameter valid
if (!$stmt->bind_param("ss", $username, $hashedPassword)) {
    echo json_encode([
        "success" => false,
        "message" => "Bind param error: " . $stmt->error
    ]);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registrasi berhasil!"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal mendaftar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
