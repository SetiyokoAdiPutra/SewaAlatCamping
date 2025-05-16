import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import DataPelanggan from "./pages/DataPelanggan"
import DataBarang from "./pages/DataBarang"
import Transaksi from "./pages/Transaksi"
import PilihBarang from "./pages/Pilihbarang";
import FormTransaksi from "./pages/FormTransaksi"


function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login tidak memakai Sidebar */}
        <Route path="/" element={<Login />} />

        {/* Semua halaman setelah login memakai AdminLayout */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/DataPelanggan" element={<DataPelanggan />} />
          <Route path="/DataBarang" element={<DataBarang />} />
          <Route path="/Transaksi" element={<Transaksi />} />
          <Route path="/PilihBarang" element={<PilihBarang />} />
          <Route path="/FormTransaksi" element={<FormTransaksi />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
