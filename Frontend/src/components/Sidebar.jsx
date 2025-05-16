import { Link } from 'react-router-dom';
import { Home, Users, Package, FileText, LogOut } from 'react-feather';
import Logo from '../assets/Logo.png';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white text-gray-900 h-screen p-5 shadow-md fixed flex flex-col justify-between">
      <div>
        {/* Logo dan Admin Panel */}
        <div className="text-center mb-6">
          <img src={Logo} alt="Logo" className="mx-auto w-20" />
          <h3 className="text-xl font-bold text-gray-600 ">Admin Panel</h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Manajemen Administrasi Cikarang Outdoor Gear
          </p>
        </div>

        {/* Menu Navigasi */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/Dashboard"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition text-[#0c740c]"
              >
                <Home size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/DataPelanggan"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition text-[#0c740c]"
              >
                <Users size={20} /> Data Pelanggan
              </Link>
            </li>
            <li>
              <Link
                to="/DataBarang"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition text-[#0c740c]"
              >
                <Package size={20} /> Data Barang
              </Link>
            </li>
            <li>
              <Link
                to="/Transaksi"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition text-[#0c740c]"
              >
                <FileText size={20} /> Transaksi Penyewaan
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button di Bagian Bawah */}
      <div className="mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition text-[#0c740c]"
        >
          <LogOut size={20} /> Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
