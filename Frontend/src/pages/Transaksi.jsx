import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, FileText, Printer, CheckCircle } from "react-feather";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const API_URL = "http://localhost/sewa_alat_camping/Backend/api/Transaksi.php";
 // URL untuk data barang

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchTransaksi();
  }, []);

  // Mengambil data transaksi
  const fetchTransaksi = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransaksi(response.data);
    } catch (error) {
      console.error("Error fetching transaksi:", error);
    }
  };

  // Melanjutkan ke halaman pemilihan barang untuk transaksi baru
  const handleTambahTransaksi = () => {
    navigate("/PilihBarang"); // Arahkan ke halaman memilih barang
  };

  return (
    <div className="p-6">
      {/* Card Jumlah Transaksi & Tambah Transaksi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Jumlah Transaksi Berjalan</h2>
          <p className="text-2xl font-semibold text-gray-900">
            {transaksi.filter((t) => t.status === "Berjalan").length}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleTambahTransaksi} // Arahkan ke halaman memilih barang
            className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold px-4 py-2 rounded-lg"
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Tabel Daftar Transaksi */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Daftar Transaksi</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nama Pelanggan</th>
              <th className="border p-2">Tanggal Sewa</th>
              <th className="border p-2">Tanggal Kembali</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Keterlambatan</th>
              <th className="border p-2">Subtotal</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.length > 0 ? (
              transaksi.map((item) => (
                <tr key={item.id_transaksi}>
                  <td className="border p-2">{item.nama_pelanggan}</td>
                  <td className="border p-2">{item.tanggal_sewa}</td>
                  <td className="border p-2">{item.tanggal_kembali}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">{item.keterlambatan} Hari</td>
                  <td className="border p-2">Rp {item.subtotal.toLocaleString()}</td>
                  <td className="border p-2 text-center">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={20} />
                    </button>
                    <button className="text-green-600 hover:text-green-800 mr-2">
                      <CheckCircle size={20} />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-800 mr-2">
                      <FileText size={20} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Printer size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center" colSpan="7">
                  Belum ada transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaksi;
