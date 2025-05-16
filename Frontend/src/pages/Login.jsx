import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost/sewa_alat_camping/Backend/api/Login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Tambahkan ini agar session bekerja
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/Dashboard"); // Redirect ke dashboard
      } else {
        setError(data.message); // Tampilkan error jika login gagal
      }
    } catch (error) {
      setError("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-6">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-18 sm:h-18" src={Logo} alt="Logo" />
          </div>

          <h3 className="text-xl font-medium text-center text-gray-600">
            Cikarang Outdoor Gear
          </h3>
          <p className="mt-1 text-center text-gray-500">
            Selamat Datang di Manajemen Administrasi Cikarang Outdoor Gear
          </p>

          {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg focus:border-green-700 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-green-600"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg focus:border-green-700 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-green-600"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="w-full mt-6">
              <button
                type="submit"
                className="block w-full px-4 py-2 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
