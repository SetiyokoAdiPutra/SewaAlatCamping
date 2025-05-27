import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FormTransaksi = () => {
  const location = useLocation();
  const [pelangganList, setPelangganList] = useState([]);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [tanggalSewa, setTanggalSewa] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const selectedBarang = location.state?.selectedBarang || [];
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/pelanggan`)
      .then((response) => {
        setPelangganList(response.data);
      })
      .catch((error) => {
        console.error("Gagal ambil data pelanggan", error);
      });
  }, []);

  const handlePelangganChange = (e) => {
    const id = e.target.value;
    const pelanggan = pelangganList.find((p) => p.id_pelanggan === id);
    setSelectedPelanggan(pelanggan);
  };

  const totalHarga = selectedBarang.reduce(
    (total, item) => total + parseInt(item.subtotal),
    0
  );

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(angka);
  };

  const handleSimpanTransaksi = async () => {
    if (!selectedPelanggan || !tanggalSewa || !tanggalKembali || selectedBarang.length === 0) {
      alert("Harap lengkapi semua data terlebih dahulu.");
      return;
    }

    const transaksiData = {
      id_pelanggan: selectedPelanggan.id_pelanggan,
      tanggal_sewa: tanggalSewa,
      tanggal_kembali: tanggalKembali,
      total_harga: totalHarga,
      barang: selectedBarang.map(item => ({
        id_barang: item.id_barang,
        jumlah: item.jumlah, 
        subtotal: item.subtotal
      }))
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_URL_API}/transaksi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaksiData)
      });

      const result = await res.json();
      if (result.success) {
        alert("Transaksi berhasil disimpan!");
        navigate(`/Struk/${result.id_transaksi}`);
      } else {
        alert("Gagal menyimpan transaksi: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan transaksi.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Form Transaksi</h2>

      {/* FORM */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Pilih Pelanggan</label>
            <select
              onChange={handlePelangganChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Pilih Pelanggan --</option>
              {pelangganList.map((pelanggan) => (
                <option key={pelanggan.id_pelanggan} value={pelanggan.id_pelanggan}>
                  {pelanggan.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Email</label>
            <input
              type="text"
              value={selectedPelanggan?.email || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">No. HP</label>
            <input
              type="text"
              value={selectedPelanggan?.no_hp || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Tanggal Sewa</label>
            <input
              type="date"
              value={tanggalSewa}
              onChange={(e) => setTanggalSewa(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Tanggal Kembali</label>
            <input
              type="date"
              value={tanggalKembali}
              onChange={(e) => setTanggalKembali(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* RINGKASAN BARANG */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-3">Daftar Barang Disewa</h3>
        <ul className="list-disc list-inside">
          {selectedBarang.map((item, index) => (
            <li key={index}>
              {item.namaBarang} - {item.stok} x {formatRupiah(item.harga)} = {formatRupiah(item.subtotal)}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-bold text-gray-800">
          Total Harga: {formatRupiah(totalHarga)}
        </p>
      </div>

      {/* TOMBOL SIMPAN */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring focus:ring-green-500 focus:ring-opacity-50"
          onClick={handleSimpanTransaksi}
        >
          Simpan Transaksi
        </button>
      </div>
    </div>
  );
};

export default FormTransaksi;
