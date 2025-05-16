<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data['id_pelanggan'], $data['tanggal_sewa'], $data['tanggal_kembali'], $data['total_harga'], $data['barang']) &&
    is_array($data['barang']) && count($data['barang']) > 0
) {
    $conn->begin_transaction();

    try {
        // Simpan data ke tabel transaksi
        $query = "INSERT INTO transaksi (id_pelanggan, tanggal_sewa, tanggal_kembali, total_harga) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("issi", $data['id_pelanggan'], $data['tanggal_sewa'], $data['tanggal_kembali'], $data['total_harga']);
        $stmt->execute();
        $id_transaksi = $stmt->insert_id;

        // Simpan detail transaksi dan update stok barang
        foreach ($data['barang'] as $item) {
            $query_detail = "INSERT INTO detail_transaksi (id_transaksi, id_barang, jumlah, subtotal) VALUES (?, ?, ?, ?)";
            $stmt_detail = $conn->prepare($query_detail);
            $stmt_detail->bind_param("iiii", $id_transaksi, $item['id_barang'], $item['jumlah'], $item['subtotal']);
            $stmt_detail->execute();

            // Update stok barang
            $query_update = "UPDATE barang SET stok = stok - ? WHERE id_barang = ?";
            $stmt_update = $conn->prepare($query_update);
            $stmt_update->bind_param("ii", $item['jumlah'], $item['id_barang']);
            $stmt_update->execute();
        }

        $conn->commit();
        echo json_encode(["message" => "Transaksi berhasil disimpan"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["error" => "Gagal menyimpan transaksi: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Data transaksi tidak lengkap"]);
}
?>
