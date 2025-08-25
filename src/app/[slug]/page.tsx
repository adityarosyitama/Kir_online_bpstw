'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface InventoryItem {
  noUrut: number;
  nibar: string;
  nomorRegister: string;
  kodeBarang: string;
  namaBarang: string;
  spesifikasiNamaBarang: string;
  merkType: string;
  tahunPerolehan: string;
  jumlahBarang: number;
  satuanBarang: number;
  keterangan: string;
  UnitKerja: string;
  Ruang: string;
}

export default function SlugPage() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop()?.toLowerCase() || '';
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/inventory?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setData(result);
      } catch (err) {
        setError('Failed to load inventory data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="p-6 text-center dark:text-white">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 dark:text-red-400">{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        No inventory data found for {slug.toUpperCase()}.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">KARTU INVENTARIS RUANGAN (KIR)</h1>
      <div className="flex mb-4 text-sm font-medium dark:text-white">
        <div className="text-left">
          <p>Kuasa Pengguna</p>
          <p>Pengguna Barang</p>
          <p>Kode Lokasi</p>
          <p>Nama Ruangan</p>
        </div>
        <div className="text-left ml-4 mr-4">
          <p>:</p>
          <p>:</p>
          <p>:</p>
          <p>:</p>
        </div>
        <div className="text-left">
          <p>TUTY AMALIA, SH.,M.Si</p>
          <p>SUHARYANTO</p>
          <p>12.000.12.04.100106.00000.00000000</p>
          <p>{data[0].Ruang.toUpperCase()}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700 border border-black dark:border-white">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900">
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">No</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Nibar</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Nomor Register</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Kode Barang</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Nama Barang</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Spesifikasi Nama Barang</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Merk/Type</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Tahun Perolehan</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Jumlah</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Satuan</th>
              <th scope="col" className="py-2 px-2 border-b border-r border-black dark:border-white text-left text-sm font-medium text-gray-700 dark:text-gray-200">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.noUrut} className="hover:bg-gray-100 dark:hover:bg-black">
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.noUrut}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.nibar}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.nomorRegister}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.kodeBarang}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.namaBarang}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.spesifikasiNamaBarang}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.merkType}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.tahunPerolehan}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.jumlahBarang}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.satuanBarang}</td>
                <td className="py-2 px-2 border-b border-r border-black dark:border-white text-sm text-gray-900 dark:text-white">{item.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center text-sm font-semibold text-red-600 dark:text-red-400">
        Catatan : Tidak dibenarkan memindah barang-barang yang ada dalam daftar ini tanpa sepengetahuan pengurus barang pengguna/pembantu pengurus barang dan penanggungjawab ruang
      </div>
      <div className="flex justify-between mb-4 text-sm font-medium dark:text-white">
        <div className="text-left">
          <p className="mb-20">Pengurus Barang Pembantu/Pengurus Barang</p>
          <p>SUHARYANTO</p>
          <p>197108192009011004</p>
        </div>
        <div className="text-right">
          <p className="mb-20">Penanggungjawab Ruang</p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  );
}