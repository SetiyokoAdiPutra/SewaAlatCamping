import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Untuk navigasi

// Fungsi untuk format harga menjadi format IDR (Rupiah)
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

const PilihBarang = () => {
  const [barang, setBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState([]); // Untuk menyimpan barang yang dipilih
  const [quantity, setQuantity] = useState({}); // Menyimpan jumlah barang yang dipilih
  const navigate = useNavigate(); // Untuk navigasi ke halaman selanjutnya

  useEffect(() => {
    // Ambil data barang dari API
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_API}/barang`);
      setBarang(response.data); // Set data barang ke state
    } catch (error) {
      console.error("Error fetching barang:", error);
    }
  };

  const handleQuantityChange = (barangId, value) => {
    // Mengubah jumlah barang yang dipilih
    setQuantity((prev) => ({
      ...prev,
      [barangId]: value
    }));
  };

  const handleAddBarang = (barangId, namaBarang, stok, harga) => {
    const qty = quantity[barangId] ? parseInt(quantity[barangId]) : 0;

    if (qty > 0 && qty <= stok) {
      const subtotal = harga * qty;

      const existingBarang = selectedBarang.find(item => item.id_barang === barangId);

      if (existingBarang) {
        const updatedBarang = selectedBarang.map(item =>
          item.id_barang === barangId
            ? { ...item, jumlah: qty, subtotal }
            : item
        );
        setSelectedBarang(updatedBarang);
      } else {
        setSelectedBarang(prev => [
          ...prev,
          {
            id_barang: barangId,
            namaBarang,
            jumlah: qty,
            harga,
            subtotal
          }
        ]);
      }

      // Reset input jumlah
      setQuantity(prev => ({ ...prev, [barangId]: "" }));
    } else {
      alert("Jumlah yang dimasukkan tidak valid.");
    }
  };

  const handleLanjutKeTransaksi = () => {
    if (selectedBarang.length === 0) {
      return alert("Pilih minimal 1 barang terlebih dahulu.");
    }
    navigate("/FormTransaksi", { state: { selectedBarang } });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Pilih Barang untuk Transaksi</h2>

      {/* Tabel Barang */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nama Barang</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Jumlah</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {barang.length > 0 ? (
              barang.map((item) => (
                <tr key={item.id_barang}>
                  <td className="border p-2">{item.nama_barang}</td>
                  <td className="border p-2">{item.stok}</td>
                  <td className="border p-2">{formatRupiah(item.harga_per_hari)}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={quantity[item.id_barang] || ""}
                      onChange={(e) => handleQuantityChange(item.id_barang, e.target.value)}
                      className="w-20 text-center border rounded-md"
                      min="1"
                      max={item.stok}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleAddBarang(item.id_barang, item.nama_barang, item.stok, item.harga_per_hari)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Tambah Barang
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center" colSpan="5">
                  Tidak ada barang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Daftar Barang yang Dipilih */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-3">Barang yang Dipilih</h3>
        <ul>
          {selectedBarang.length > 0 ? (
            selectedBarang.map((item, index) => (
              <li key={index}>
                {item.namaBarang} - {item.jumlah} x {formatRupiah(item.harga)} = {formatRupiah(item.subtotal)}
              </li>
            ))
          ) : (
            <li>Belum ada barang yang dipilih</li>
          )}
        </ul>
      </div>

      {/* Tombol Lanjutkan */}
      <div className="flex justify-end">
        <button
          onClick={handleLanjutKeTransaksi}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
        >
          Lanjutkan ke Transaksi
        </button>
      </div>
    </div>
  );
};

export default PilihBarang;