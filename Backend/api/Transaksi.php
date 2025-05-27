<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Preflight Handler (harus paling atas)
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Content-Type: application/json");
    http_response_code(200);
    exit;
}

// CORS & JSON Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

include __DIR__ . '/../config/database.php';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $query = "SELECT t.*, p.nama AS nama_pelanggan, p.alamat, p.no_hp, p.email 
                      FROM transaksi t 
                      JOIN pelanggan p ON t.id_pelanggan = p.id_pelanggan 
                      WHERE t.id_transaksi = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $detail = $conn->query("SELECT dt.*, b.nama_barang 
                                        FROM detail_transaksi dt 
                                        JOIN barang b ON dt.id_barang = b.id_barang 
                                        WHERE dt.id_transaksi = $id");
                $row['barang'] = $detail ? $detail->fetch_all(MYSQLI_ASSOC) : [];
                echo json_encode($row);
            } else {
                echo json_encode(["success" => false, "message" => "Transaksi tidak ditemukan"]);
            }
        } else {
            $query = "SELECT t.*, p.nama AS nama_pelanggan FROM transaksi t 
                      JOIN pelanggan p ON t.id_pelanggan = p.id_pelanggan 
                      ORDER BY t.id_transaksi DESC";
            $result = $conn->query($query);

            if (!$result) {
                echo json_encode(["success" => false, "message" => "Query gagal: " . $conn->error]);
                exit;
            }

            $data = [];
            while ($row = $result->fetch_assoc()) {
                $id_transaksi = $row['id_transaksi'];
                $detail = $conn->query("SELECT dt.*, b.nama_barang 
                                        FROM detail_transaksi dt 
                                        JOIN barang b ON dt.id_barang = b.id_barang 
                                        WHERE dt.id_transaksi = $id_transaksi");
                $row['barang'] = $detail ? $detail->fetch_all(MYSQLI_ASSOC) : [];
                $data[] = $row;
            }

            echo json_encode($data);
        }
        break;

    case 'POST':
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (
            isset($data['id_pelanggan'], $data['tanggal_sewa'], $data['tanggal_kembali'], $data['total_harga'], $data['barang']) &&
            is_array($data['barang']) && count($data['barang']) > 0
        ) {
            $conn->begin_transaction();
            try {
                $stmt = $conn->prepare("INSERT INTO transaksi (id_pelanggan, tanggal_sewa, tanggal_kembali, total_harga) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("issi", $data['id_pelanggan'], $data['tanggal_sewa'], $data['tanggal_kembali'], $data['total_harga']);

                if (!$stmt->execute()) {
                    throw new Exception("Gagal insert transaksi: " . $stmt->error);
                }

                $id_transaksi = $stmt->insert_id;

                foreach ($data['barang'] as $item) {
                    if (!isset($item['id_barang'], $item['jumlah'], $item['subtotal'])) {
                        throw new Exception("Data barang tidak lengkap");
                    }

                    $stmt_detail = $conn->prepare("INSERT INTO detail_transaksi (id_transaksi, id_barang, jumlah, subtotal) VALUES (?, ?, ?, ?)");
                    $stmt_detail->bind_param("iiii", $id_transaksi, $item['id_barang'], $item['jumlah'], $item['subtotal']);
                    if (!$stmt_detail->execute()) {
                        throw new Exception("Gagal insert detail: " . $stmt_detail->error);
                    }

                    $stmt_update = $conn->prepare("UPDATE barang SET stok = stok - ? WHERE id_barang = ?");
                    $stmt_update->bind_param("ii", $item['jumlah'], $item['id_barang']);
                    if (!$stmt_update->execute()) {
                        throw new Exception("Gagal update stok: " . $stmt_update->error);
                    }
                }

                $conn->commit();
                echo json_encode([
                    "success" => true,
                    "message" => "Transaksi berhasil ditambahkan",
                    "id_transaksi" => $id_transaksi
                ]);
            } catch (Exception $e) {
                $conn->rollback();
                echo json_encode(["success" => false, "message" => "Gagal menyimpan transaksi: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Data transaksi tidak lengkap"]);
        }
        break;
    case 'PUT':
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (
            isset($data['id_transaksi'], $data['id_pelanggan'], $data['tanggal_sewa'], $data['tanggal_kembali'], $data['total_harga'], $data['barang']) &&
            is_array($data['barang'])
        ) {
            $conn->begin_transaction();
            try {
                $stmt = $conn->prepare("UPDATE transaksi SET id_pelanggan = ?, tanggal_sewa = ?, tanggal_kembali = ?, total_harga = ?, status = ? WHERE id_transaksi = ?");
                $stmt->bind_param("issisi", $data['id_pelanggan'], $data['tanggal_sewa'], $data['tanggal_kembali'], $data['total_harga'], $data['status'], $data['id_transaksi']);

                $stmt->execute();

                // Restore stok
                $oldDetail = $conn->query("SELECT * FROM detail_transaksi WHERE id_transaksi = {$data['id_transaksi']}");
                while ($row = $oldDetail->fetch_assoc()) {
                    $conn->query("UPDATE barang SET stok = stok + {$row['jumlah']} WHERE id_barang = {$row['id_barang']}");
                }
                $conn->query("DELETE FROM detail_transaksi WHERE id_transaksi = {$data['id_transaksi']}");

                foreach ($data['barang'] as $item) {
                    $stmt_detail = $conn->prepare("INSERT INTO detail_transaksi (id_transaksi, id_barang, jumlah, subtotal) VALUES (?, ?, ?, ?)");
                    $stmt_detail->bind_param("iiii", $data['id_transaksi'], $item['id_barang'], $item['jumlah'], $item['subtotal']);
                    $stmt_detail->execute();

                    $stmt_update = $conn->prepare("UPDATE barang SET stok = stok - ? WHERE id_barang = ?");
                    $stmt_update->bind_param("ii", $item['jumlah'], $item['id_barang']);
                    $stmt_update->execute();
                }

                $conn->commit();
                echo json_encode(["success" => true, "message" => "Transaksi berhasil diperbarui"]);
            } catch (Exception $e) {
                $conn->rollback();
                echo json_encode(["success" => false, "message" => "Gagal update transaksi: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Data tidak lengkap untuk update"]);
        }
        break;

    case 'DELETE':
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (isset($data['id_transaksi'])) {
            $conn->begin_transaction();
            try {
                $detail = $conn->query("SELECT * FROM detail_transaksi WHERE id_transaksi = {$data['id_transaksi']}");
                while ($row = $detail->fetch_assoc()) {
                    $conn->query("UPDATE barang SET stok = stok + {$row['jumlah']} WHERE id_barang = {$row['id_barang']}");
                }

                $conn->query("DELETE FROM detail_transaksi WHERE id_transaksi = {$data['id_transaksi']}");
                $conn->query("DELETE FROM transaksi WHERE id_transaksi = {$data['id_transaksi']}");

                $conn->commit();
                echo json_encode(["success" => true, "message" => "Transaksi berhasil dihapus"]);
            } catch (Exception $e) {
                $conn->rollback();
                echo json_encode(["success" => false, "message" => "Gagal hapus transaksi: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "ID transaksi tidak ditemukan"]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Metode tidak diizinkan"]);
        break;
}
?>
