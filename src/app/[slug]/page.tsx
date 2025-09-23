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

// Define the List component
function List({ keterangan, nama }: { keterangan: string; nama: string }) {
  return (
    <div className="flex text-sm font-medium">
      <div className="text-left">
        <p>{keterangan}</p>
      </div>
      <div className="text-left ml-4 mr-4">
        <p>:</p>
      </div>
      <div className="text-left">
        <p>{nama}</p>
      </div>
    </div>
  );
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
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-red-600">
        No inventory data found for {slug.toUpperCase()}.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">KARTU INVENTARIS RUANGAN (KIR)</h1>
      <div className="mb-4">
        <List keterangan="Kuasa Pengguna" nama="TUTY AMALIA, SH.,M.Si" />
        <List keterangan="Pengguna Barang" nama="SUHARYANTO" />
        <List keterangan="Kode Lokasi" nama="12.000.12.04.100106.00000.00000000" />
        <List keterangan="Nama Ruangan" nama={data[0]?.Ruang.toUpperCase()} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">No</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Nibar</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Nomor Register</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Kode Barang</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Nama Barang</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Spesifikasi Nama Barang</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Merk/Type</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Tahun Perolehan</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Jumlah</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Satuan</th>
              <th scope="col" className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.noUrut} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.noUrut}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.nibar}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.nomorRegister}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.kodeBarang}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.namaBarang}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.spesifikasiNamaBarang}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.merkType}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.tahunPerolehan}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.jumlahBarang}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.satuanBarang}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{item.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center text-sm font-semibold text-red-600">
        Catatan: Tidak dibenarkan memindah barang-barang yang ada dalam daftar ini tanpa sepengetahuan pengurus barang pengguna/pembantu pengurus barang dan penanggungjawab ruang
      </div>
      <div className="flex justify-between mt-6 text-sm font-medium">
        <div className="text-left">
          <p className="mb-20">Pengurus Barang Pembantu/Pengurus Barang</p>
          <p>SUHARYANTO</p>
          <p>197108192009011004</p>
        </div>
        <div className="text-right">
          <p className="mb-20">Penanggungjawab Ruang</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </div>
      </div>
    </div>
  );
}