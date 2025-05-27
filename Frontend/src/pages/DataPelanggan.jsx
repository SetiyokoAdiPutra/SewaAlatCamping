import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Trash2, Edit } from "react-feather";

const DataPelanggan = () => {
  const [pelanggan, setPelanggan] = useState([]);
  const [form, setForm] = useState({ id_pelanggan: null, nama: "", email: "", no_hp: "", alamat: "" });

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const fetchPelanggan = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_API}/pelanggan`);
      setPelanggan(response.data);
    } catch (error) {
      console.error("Error fetching pelanggan:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTambah = async (e) => {
    e.preventDefault();
    try {
      if (form.id_pelanggan) {
        await axios.put(`${import.meta.env.VITE_URL_API}/pelanggan`, form); // Update data jika id_pelanggan ada
      } else {
        await axios.post(`${import.meta.env.VITE_URL_API}/pelanggan`, form); // Tambah data baru jika id_pelanggan kosong
      }
      fetchPelanggan();
      setForm({ id_pelanggan: null, nama: "", email: "", no_hp: "", alamat: "" });
    } catch (error) {
      console.error("Error saving pelanggan:", error);
    }
  };

  const handleHapus = async (id_pelanggan) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL_API}/pelanggan`, { data: { id_pelanggan } });
      fetchPelanggan();
    } catch (error) {
      console.error("Error deleting pelanggan:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item }); // Mengisi form dengan data pelanggan yang dipilih untuk diedit
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center justify-center text-center gap-2">
          <Users className="text-green-700" size={48} />
          <h2 className="text-xl font-bold text-gray-700">Total Pelanggan</h2>
          <p className="text-3xl font-bold text-green-700">{pelanggan.length}</p>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-3">{form.id_pelanggan ? "Edit Pelanggan" : "Tambah Pelanggan"}</h2>
          <form onSubmit={handleTambah}>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" className="w-full p-2 mb-2 text-gray-700 border rounded-lg focus:border-green-700 focus:ring focus:ring-green-600" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 mb-2 text-gray-700 border rounded-lg focus:border-green-700 focus:ring focus:ring-green-600" />
            <input type="text" name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="No HP" className="w-full p-2 mb-2 text-gray-700 border rounded-lg focus:border-green-700 focus:ring focus:ring-green-600" />
            <textarea name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat" className="w-full p-2 mb-2 text-gray-700 border rounded-lg focus:border-green-700 focus:ring focus:ring-green-600"></textarea>
            <button type="submit" className="p-2 w-full text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring focus:ring-green-500 focus:ring-opacity-50">
              {form.id_pelanggan ? "Update Data" : "Tambahkan Data"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Daftar Pelanggan</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-gray-600">Nama</th>
              <th className="border p-2 text-gray-600">Email</th>
              <th className="border p-2 text-gray-600">No Telepon</th>
              <th className="border p-2 text-gray-600">Alamat</th>
              <th className="border p-2 text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pelanggan.length > 0 ? (
              pelanggan.map((item) => (
                <tr key={item.id_pelanggan}>
                    <td className="border p-2">{item.nama}</td>
                    <td className="border p-2">{item.email}</td>
                    <td className="border p-2">{item.no_hp}</td>
                    <td className="border p-2">{item.alamat}</td>
                    <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                            <Edit size={20} />
                        </button>
                        <button onClick={() => handleHapus(item.id_pelanggan)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={20} />
                        </button>
                        </div>
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

export default DataPelanggan;
