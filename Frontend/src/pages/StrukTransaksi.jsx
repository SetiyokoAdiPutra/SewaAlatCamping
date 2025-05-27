import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import Logo from "../assets/Logo.png";
import axios from "axios";

const StrukTransaksi = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const printMode = searchParams.get("print") === "true";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/transaksi?id=${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Gagal ambil struk:", err));
  }, [id]);

  useEffect(() => {
    if (printMode && data) {
      setTimeout(() => window.print(), 500);
    }
  }, [printMode, data]);

    const handleDownloadPDF = async () => {
    const element = document.getElementById("struk-pdf");

    try {
        const blob = await domtoimage.toBlob(element);
        const imgURL = URL.createObjectURL(blob);
        const img = new Image();
        img.src = imgURL;

        img.onload = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const scale = pdfWidth / img.width;
        const pdfHeight = img.height * scale;

        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

        const now = new Date();
        const timestamp = now.toLocaleString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).replace(/[/:]/g, "-").replace(", ", "_");

        const filename = `Struk-${data.nama_pelanggan || "Transaksi"}-${timestamp}.pdf`;
        pdf.save(filename);

        URL.revokeObjectURL(imgURL);
        };
    } catch (error) {
        console.error("Gagal generate PDF:", error);
        alert("Gagal mengunduh PDF. Coba lagi.");
    }
    };


  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow print:shadow-none">
      <div id="struk-pdf" className="bg-white p-6 text-black">
        <div className="text-center border-b pb-4 mb-4">
          <img src={Logo} alt="Logo" className="mx-auto w-20" />
          <h2 className="text-lg font-bold uppercase">Sewa Alat Camping Cikarang Outdoor Gear</h2>
          <p>Jl. Kp. Bojong Koneng No.106, RT.01/RW.02</p>
          <p>0853 6592 6600 | @cikarangoutdoorgear</p>
        </div>

        <h3 className="font-bold text-center mb-4">FORMULIR SEWA ALAT CAMPING</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <p>Nama: <span className="font-semibold">{data.nama_pelanggan}</span></p>
          <p>Alamat: <span className="font-semibold">{data.alamat || "-"}</span></p>
          <p>No. HP/WA: <span className="font-semibold">{data.no_hp || "-"}</span></p>
          <p>Tgl & Jam Disewa: <span className="font-semibold">{data.tanggal_sewa}</span></p>
          <p>Tgl & Jam Dipulangkan: <span className="font-semibold">{data.tanggal_kembali}</span></p>
        </div>

        <table className="w-full border border-collapse mb-4 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-1">No</th>
              <th className="border p-1">Nama Barang</th>
              <th className="border p-1">Detail</th>
              <th className="border p-1">Harga</th>
            </tr>
          </thead>
          <tbody>
            {data.barang?.map((item, index) => (
              <tr key={index}>
                <td className="border p-1 text-center">{index + 1}</td>
                <td className="border p-1">{item.nama_barang}</td>
                <td className="border p-1">Jumlah: {item.jumlah}x</td>
                <td className="border p-1">Rp {parseInt(item.subtotal).toLocaleString("id-ID")}</td>
              </tr>
            ))}
            <tr>
              <td className="border p-1 font-bold text-center" colSpan={3}>TOTAL</td>
              <td className="border p-1 font-bold">Rp {parseInt(data.total_harga).toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-xs italic mb-8">
          Selanjutnya bertanggung jawab penuh terhadap perlengkapan alat camping dan segera dikembalikan
          pada tanggal dan jam yang ditentukan.
        </p>

        <div className="grid grid-cols-2 text-center text-sm">
          <div>
            <p>Mengetahui</p>
            <br /><br /><br />
            <p className="font-bold">Am Camping</p>
          </div>
          <div>
            <p>
              P. Outdoor Gear,{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <br /><br /><br />
            <p className="font-bold">{data.nama_pelanggan}</p>
          </div>
        </div>
      </div>

      {!printMode && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-[#0c740c] text-white rounded hover:bg-[#396d39]"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default StrukTransaksi;
