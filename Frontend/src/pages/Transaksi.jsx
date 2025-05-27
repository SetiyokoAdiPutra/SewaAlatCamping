import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Printer, CheckCircle } from "react-feather";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_URL_API}/transaksi`;

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransaksi(response.data);
    } catch (error) {
      console.error("Error fetching transaksi:", error);
    }
  };

  const handleTambahTransaksi = () => {
    navigate("/PilihBarang");
  };

  const handleKonfirmasi = async (item) => {
    if (!window.confirm("Yakin ingin mengkonfirmasi transaksi ini?")) return;
    try {
      const payload = {
        id_transaksi: item.id_transaksi,
        id_pelanggan: item.id_pelanggan,
        tanggal_sewa: item.tanggal_sewa,
        tanggal_kembali: item.tanggal_kembali,
        total_harga: item.total_harga,
        status: "Selesai",
        barang: item.barang.map((b) => ({
          id_barang: b.id_barang,
          jumlah: b.jumlah,
          subtotal: b.subtotal,
        })),
      };
      await axios.put(API_URL, payload);
      fetchTransaksi();
    } catch (error) {
      console.error("Gagal konfirmasi transaksi:", error);
      alert("Terjadi kesalahan saat mengkonfirmasi transaksi.");
    }
  };

  const handleStruk = (id) => {
    navigate(`/Struk/${id}`);
  };

  const handleCetak = (id) => {
    window.open(`/Struk/${id}?print=true`, "_blank");
  };

  const transaksiBerjalan = transaksi.filter((t) => t.status === "Berjalan");
  const transaksiSelesai = transaksi.filter((t) => t.status === "Selesai");

  const renderRow = (item) => (
    <tr key={item.id_transaksi}>
      <td className="border p-2">{item.nama_pelanggan}</td>
      <td className="border p-2">{item.tanggal_sewa}</td>
      <td className="border p-2">{item.tanggal_kembali}</td>
      <td className="border p-2">{item.status}</td>
      <td className="border p-2">{item.keterlambatan || 0} Hari</td>
      <td className="border p-2">
        Rp {parseInt(item.total_harga || 0).toLocaleString()}
      </td>
      <td className="border p-2 text-center flex justify-center gap-2">
        {item.status === "Berjalan" && (
          <button
            className="text-green-600 hover:text-green-800"
            onClick={() => handleKonfirmasi(item)}
          >
            <CheckCircle size={20} />
          </button>
        )}
        <button
          className="text-yellow-600 hover:text-yellow-800"
          onClick={() => handleStruk(item.id_transaksi)}
        >
          <FileText size={20} />
        </button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => handleCetak(item.id_transaksi)}
        >
          <Printer size={20} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Jumlah Transaksi Berjalan</h2>
          <p className="text-2xl font-semibold text-gray-900">
            {transaksiBerjalan.length}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleTambahTransaksi}
            className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold px-4 py-2 rounded-lg"
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

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
            {transaksiBerjalan.map(renderRow)}
            {transaksiSelesai.map(renderRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaksi;
