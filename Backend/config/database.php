<?php
$host = "localhost";
$user = "root";  // Ganti jika MySQL kamu punya user lain
$password = "";  // Kosongkan jika tidak ada password
$database = "sewa_alat_camping";

// Buat koneksi
$conn = new mysqli($host, $user, $password, $database);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>