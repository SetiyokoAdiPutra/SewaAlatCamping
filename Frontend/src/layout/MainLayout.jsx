import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar tetap di kiri */}
      <div className="w-64 min-h-screen bg-white shadow-md print:hidden">
        <Sidebar />
      </div>

      {/* Konten utama fleksibel agar tidak tertutup Sidebar */}
      <div className="flex-1 p-5 bg-gray-100">
        <Outlet /> {/* Menampilkan halaman sesuai route */}
      </div>
    </div>
  );
};

export default AdminLayout;
