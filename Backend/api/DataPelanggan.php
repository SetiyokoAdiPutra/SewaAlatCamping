<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $query = "SELECT * FROM pelanggan";
        $result = $conn->query($query);

        $pelanggan = array();
        while ($row = $result->fetch_assoc()) {
            $pelanggan[] = $row;
        }

        echo json_encode($pelanggan);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['nama'], $data['email'], $data['no_hp'], $data['alamat'])) {
            $query = "INSERT INTO pelanggan (nama, email, no_hp, alamat) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssss", $data['nama'], $data['email'], $data['no_hp'], $data['alamat']);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Pelanggan berhasil ditambahkan"]);
            } else {
                echo json_encode(["error" => "Gagal menambahkan pelanggan"]);
            }
        } else {
            echo json_encode(["error" => "Data tidak lengkap"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['id_pelanggan'], $data['nama'], $data['email'], $data['no_hp'], $data['alamat'])) {
            $query = "UPDATE pelanggan SET nama=?, email=?, no_hp=?, alamat=? WHERE id_pelanggan=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssi", $data['nama'], $data['email'], $data['no_hp'], $data['alamat'], $data['id_pelanggan']);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Data pelanggan berhasil diperbarui"]);
            } else {
                echo json_encode(["error" => "Gagal memperbarui data pelanggan"]);
            }
        } else {
            echo json_encode(["error" => "Data tidak lengkap"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['id_pelanggan'])) {
            $query = "DELETE FROM pelanggan WHERE id_pelanggan=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $data['id_pelanggan']);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Pelanggan berhasil dihapus"]);
            } else {
                echo json_encode(["error" => "Gagal menghapus pelanggan"]);
            }
        } else {
            echo json_encode(["error" => "ID pelanggan tidak ditemukan"]);
        }
        break;

    default:
        echo json_encode(["error" => "Metode HTTP tidak valid"]);
        break;
}

$conn->close();
?>
