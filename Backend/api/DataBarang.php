<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Header untuk CORS dan pengaturan konten JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

include __DIR__ . '/../config/database.php';

function formatRupiah($angka) {
    return number_format($angka, 0, ',', '.');
}

$method = $_SERVER['REQUEST_METHOD']; 

switch ($method) {
    case 'GET':
        if (isset($_GET['kategori'])) {
            $kategori = $_GET['kategori'];
            $query = "SELECT * FROM barang WHERE kategori = ?";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                die(json_encode(["error" => "Prepare gagal: " . $conn->error]));
            }
            $stmt->bind_param("s", $kategori);
        } else {
            $query = "SELECT * FROM barang";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                die(json_encode(["error" => "Prepare gagal: " . $conn->error]));
            }
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $barang = [];
        while ($row = $result->fetch_assoc()) {
            $row['harga'] = formatRupiah($row['harga_per_hari']);
            $barang[] = $row;
        }

        echo json_encode($barang);
        break;
    
    case 'POST':
        // Menangani data POST untuk menambah barang baru
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['nama_barang'], $data['stok'], $data['harga_per_hari'], $data['kategori'])) {
            $query = "INSERT INTO barang (nama_barang, stok, harga_per_hari, kategori) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                die(json_encode(["error" => "Prepare gagal: " . $conn->error]));
            }
            $stmt->bind_param("siss", $data['nama_barang'], $data['stok'], $data['harga_per_hari'], $data['kategori']);
            $stmt->execute();
            echo json_encode(["message" => "Barang berhasil ditambahkan"]);
        } else {
            echo json_encode(["error" => "Data tidak lengkap"]);
        }
        break;
    
    case 'PUT':
        // Menangani data PUT untuk memperbarui barang
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id_barang'], $data['nama_barang'], $data['stok'], $data['harga_per_hari'], $data['kategori'])) {
            $query = "UPDATE barang SET nama_barang = ?, stok = ?, harga_per_hari = ?, kategori = ? WHERE id_barang = ?";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                die(json_encode(["error" => "Prepare gagal: " . $conn->error]));
            }
            $stmt->bind_param("sissi", $data['nama_barang'], $data['stok'], $data['harga_per_hari'], $data['kategori'], $data['id_barang']);
            $stmt->execute();
            echo json_encode(["message" => "Barang berhasil diperbarui"]);
        } else {
            echo json_encode(["error" => "Data tidak lengkap untuk update"]);
        }
        break;
    
    case 'DELETE':
        // Menangani data DELETE untuk menghapus barang
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id_barang'])) {
            $query = "DELETE FROM barang WHERE id_barang = ?";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                die(json_encode(["error" => "Prepare gagal: " . $conn->error]));
            }
            $stmt->bind_param("i", $data['id_barang']);
            $stmt->execute();
            echo json_encode(["message" => "Barang berhasil dihapus"]);
        } else {
            echo json_encode(["error" => "ID Barang tidak ditemukan"]);
        }
        break;
    
    case 'OPTIONS':
        // Untuk pre-flight request CORS
        http_response_code(200);
        break;
    
    default:
        echo json_encode(["error" => "Metode tidak diizinkan"]);
        break;
}
?>
