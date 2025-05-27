import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Users, FileText } from "react-feather";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [jumlahBarang, setJumlahBarang] = useState(0);
  const [jumlahPelanggan, setJumlahPelanggan] = useState(0);
  const [transaksiBerjalan, setTransaksiBerjalan] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [barangRes, pelangganRes, transaksiRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_URL_API}/barang`),
        axios.get(`${import.meta.env.VITE_URL_API}/pelanggan`),
        axios.get(`${import.meta.env.VITE_URL_API}/transaksi`)
      ]);

      const barang = barangRes.data.length;
      const pelanggan = pelangganRes.data.length;
      const transaksi = transaksiRes.data.filter(t => t.status === "Berjalan");

      setJumlahBarang(barang);
      setJumlahPelanggan(pelanggan);
      setTransaksiBerjalan(transaksi.length);
      setTransaksiList(transaksi);

      setChartData([
        { name: "Barang", jumlah: barang },
        { name: "Pelanggan", jumlah: pelanggan },
        { name: "Transaksi", jumlah: transaksi.length }
      ]);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Package size={24} className="text-blue-600" />}
          label="Jumlah Barang"
          value={jumlahBarang}
          bg="bg-blue-100"
        />
        <StatCard
          icon={<Users size={24} className="text-green-600" />}
          label="Jumlah Pelanggan"
          value={jumlahPelanggan}
          bg="bg-green-100"
        />
        <StatCard
          icon={<FileText size={24} className="text-yellow-600" />}
          label="Transaksi Berjalan"
          value={transaksiBerjalan}
          bg="bg-yellow-100"
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistik Jumlah Data</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel Transaksi Berjalan */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Transaksi Sedang Berjalan</h2>
        <div className="overflow-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nama Pelanggan</th>
                <th className="border p-2 text-left">Tanggal Sewa</th>
                <th className="border p-2 text-left">Tanggal Kembali</th>
                <th className="border p-2 text-left">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {transaksiList.length > 0 ? (
                transaksiList.map((item) => (
                  <tr key={item.id_transaksi}>
                    <td className="border p-2">{item.nama_pelanggan}</td>
                    <td className="border p-2">{item.tanggal_sewa}</td>
                    <td className="border p-2">{item.tanggal_kembali}</td>
                    <td className="border p-2">
                      Rp {parseInt(item.total_harga).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    Tidak ada transaksi berjalan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center">
    <div className={`p-3 rounded-full mr-4 ${bg}`}>{icon}</div>
    <div>
      <p className="text-gray-600">{label}</p>
      <h2 className="text-xl font-bold text-gray-800">{value}</h2>
    </div>
  </div>
);

export default Dashboard;
