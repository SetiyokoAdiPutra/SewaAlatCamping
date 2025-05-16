import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit } from "react-feather";

const API_URL = "http://localhost/sewa_alat_camping/Backend/api/DataBarang.php";

const DataBarang = () => {
  const [barang, setBarang] = useState([]);
  const [form, setForm] = useState({ nama_barang: "", stok: "", harga_per_hari: "", kategori: "" });
  const [kategoriList, setKategoriList] = useState([]);
  const [searchKategori, setSearchKategori] = useState("");
  const [editMode, setEditMode] = useState(false); // ✅ Mode edit
  const [editId, setEditId] = useState(null); // ✅ ID barang yang sedang diedit

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const response = await axios.get(API_URL);
      setBarang(response.data);
      extractKategori(response.data);
    } catch (error) {
      console.error("Error fetching barang:", error);
    }
  };

  const extractKategori = (data) => {
    const uniqueKategori = [...new Set(data.map(item => item.kategori))];
    setKategoriList(uniqueKategori);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTambah = async (e) => {
    e.preventDefault();
    if (editMode) {
      // ✅ Update Data Barang
      try {
        await axios.put(API_URL, { id_barang: editId, ...form });
        setEditMode(false);
        setEditId(null);
      } catch (error) {
        console.error("Error updating barang:", error);
      }
    } else {
      // ✅ Tambah Data Barang
      try {
        await axios.post(API_URL, form);
      } catch (error) {
        console.error("Error adding barang:", error);
      }
    }
    fetchBarang();
    setForm({ nama_barang: "", stok: "", harga_per_hari: "", kategori: "" });
  };

  const handleEdit = (item) => {
    // ✅ Masuk ke mode edit dan isi form dengan data barang yang dipilih
    setForm({ nama_barang: item.nama_barang, stok: item.stok, harga_per_hari: item.harga_per_hari, kategori: item.kategori });
    setEditMode(true);
    setEditId(item.id_barang);
  };

  const handleHapus = async (id_barang) => {
    try {
      await axios.delete(API_URL, { data: { id_barang } });
      fetchBarang();
    } catch (error) {
      console.error("Error deleting barang:", error);
    }
  };

  const filteredBarang = searchKategori ? barang.filter(item => item.kategori === searchKategori) : barang;

  // Fungsi untuk memformat harga menjadi format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  return (
    <div className="p-6">
      {/* Search Bar & Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search Bar */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Cari Berdasarkan Kategori</h2>
          <select onChange={(e) => setSearchKategori(e.target.value)} className="w-full p-2 border rounded-lg">
            <option value="">Semua Kategori</option>
            {kategoriList.map((kat, index) => (
              <option key={index} value={kat}>{kat}</option>
            ))}
          </select>
        </div>

        {/* Form Tambah/Update Barang */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 mb-3">{editMode ? "Update Barang" : "Tambah Barang"}</h2>
          <form onSubmit={handleTambah}>
            <input type="text" name="nama_barang" value={form.nama_barang} onChange={handleChange} placeholder="Nama Barang" className="w-full p-2 mb-2 border rounded-lg" />
            <input type="number" name="stok" value={form.stok} onChange={handleChange} placeholder="Stok" className="w-full p-2 mb-2 border rounded-lg" />
            <input type="number" name="harga_per_hari" value={form.harga_per_hari} onChange={handleChange} placeholder="Harga per Hari" className="w-full p-2 mb-2 border rounded-lg" />
            <input type="text" name="kategori" value={form.kategori} onChange={handleChange} placeholder="Kategori" className="w-full p-2 mb-2 border rounded-lg" />
            <button type="submit" className={`p-2 w-full text-white rounded-lg ${editMode ? "bg-green-700 hover:bg-green-800" : "bg-green-700 hover:bg-green-800"}`}>
              {editMode ? "Update Data" : "Tambahkan Data"}
            </button>
          </form>
        </div>
      </div>

      {/* Tabel Data Barang */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Daftar Barang</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nama Barang</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredBarang.length > 0 ? (
              filteredBarang.map((item) => (
                <tr key={item.id_barang}>
                  <td className="border p-2">{item.nama_barang}</td>
                  <td className="border p-2">{item.stok}</td>
                  <td className="border p-2">{formatRupiah(item.harga_per_hari)}</td>
                  <td className="border p-2">{item.kategori}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleHapus(item.id_barang)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center" colSpan="5">Belum ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataBarang;
