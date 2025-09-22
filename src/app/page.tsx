'use client';

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  satuanBarang: string;
  keterangan: string;
  UnitKerja: string;
  Ruang: string;
}

export default function Home() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop()?.toLowerCase() || '';
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/inventory`);
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

  // Get unique rooms for filter dropdown
  const rooms = ['all', ...new Set(data.map(item => item.Ruang))];

  // Filter data based on selected room
  const filteredData = filterRoom === 'all' ? data : data.filter(item => item.Ruang === filterRoom);

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sorting
  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Summary metrics
  const totalItems = data.reduce((sum, item) => sum + item.jumlahBarang, 0);
  const itemsByRoom = rooms.slice(1).map(room => ({
    room,
    count: data.filter(item => item.Ruang === room).length,
  }));

  // Chart data for items by room
  const chartData = {
    labels: itemsByRoom.map(item => item.room),
    datasets: [{
      label: 'Number of Items',
      data: itemsByRoom.map(item => item.count),
      backgroundColor: '#36A2EB',
      borderColor: '#2A80B9',
      borderWidth: 1,
    }],
  };

  // Room inventory table data
  const roomInventoryData = data.reduce((acc, item) => {
    if (!acc[item.Ruang]) {
      acc[item.Ruang] = {};
    }
    if (!acc[item.Ruang][item.namaBarang]) {
      acc[item.Ruang][item.namaBarang] = 0;
    }
    acc[item.Ruang][item.namaBarang] += item.jumlahBarang;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Specific rooms for Wisma Abiyoso
  const wismaAbiyoso = [
    'W. Andong Sumawi',
    'W. Argo Candi A',
    'W. Argo Candi B',
    'W. Balai Kambang',
    'W. Giri Sarangan',
    'W. Godomandono',
    'W. Grojogan Sewu',
    'W. Indrokilo',
    'W. Jolo Tundho',
    'W. Pagombakan',
    'W. Sapto Pratolo',
    'W. Talkondho',
    'W. Wukirotawu'
  ];

  // Specific rooms for Wisma Budhi Luhur
  const wismaBudhiLuhur = [
    'Wisma A',
    'Wisma B',
    'Wisma C',
    'Wisma D',
    'Wisma E',
    'Wisma F',
    'Wisma G',
    'Wisma H'
  ];

  // Get all unique item names across specific rooms for Wisma Abiyoso
  const allItemNamesAbiyoso = Array.from(
    new Set(
      data
        .filter(item => wismaAbiyoso.includes(item.Ruang))
        .map(item => item.namaBarang)
    )
  ).sort();

  // Get all unique item names across specific rooms for Wisma Budhi Luhur
  const allItemNamesBudhiLuhur = Array.from(
    new Set(
      data
        .filter(item => wismaBudhiLuhur.includes(item.Ruang))
        .map(item => item.namaBarang)
    )
  ).sort();

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
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          KIR Online BPSTW Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Items</h2>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalItems}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Rooms</h2>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{rooms.length - 1}</p>
          </div>
        </div>

        {/* Filter and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Filter by Room
            </h2>
            <select
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              {rooms.map(room => (
                <option key={room} value={room}>
                  {room === 'all' ? 'All Rooms' : room}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Items by Room
            </h2>
            <Bar
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Items' },
                  },
                  x: {
                    title: { display: true, text: 'Room' },
                  },
                },
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Inventory List
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="text-gray-700 dark:text-gray-200 mr-2">Show</label>
              <select
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-gray-700 dark:text-gray-200 ml-2">entries</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                First
              </button>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-700 dark:text-gray-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                Next
              </button>
              <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                Last
              </button>
            </div>
          </div>
          <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 cursor-pointer" onClick={() => handleSort('noUrut')}>
                  No {sortConfig?.key === 'noUrut' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('namaBarang')}>
                  Item Name {sortConfig?.key === 'namaBarang' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('Ruang')}>
                  Room {sortConfig?.key === 'Ruang' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2">Specification</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('tahunPerolehan')}>
                  Acquisition Year {sortConfig?.key === 'tahunPerolehan' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(item => (
                <tr key={item.nibar} className="border-b dark:border-gray-700">
                  <td className="p-2">{item.noUrut}</td>
                  <td className="p-2">{item.namaBarang}</td>
                  <td className="p-2">{item.Ruang}</td>
                  <td className="p-2">{item.spesifikasiNamaBarang || '-'}</td>
                  <td className="p-2">{item.tahunPerolehan}</td>
                  <td className="p-2">{item.jumlahBarang}</td>
                  <td className="p-2">{item.satuanBarang}</td>
                  <td className="p-2">{item.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Wisma Summary Abiyoso */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Wisma Summary Abiyoso
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-2 sticky left-0 bg-gray-200 dark:bg-gray-700 z-10">Nama Ruang</th>
                  {allItemNamesAbiyoso.map((itemName) => (
                    <th key={itemName} className="p-2 border border-gray-300 dark:border-gray-600">
                      <div className="text-xs whitespace-nowrap">{itemName}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wismaAbiyoso.map((room) => (
                  <tr key={room} className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-300 dark:border-gray-600">
                      {room}
                    </td>
                    {allItemNamesAbiyoso.map((itemName) => (
                      <td key={itemName} className="p-2 text-center border border-gray-300 dark:border-gray-600">
                        {roomInventoryData[room]?.[itemName] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wisma Summary Budhi Luhur */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Wisma Summary Budhi Luhur
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-2 sticky left-0 bg-gray-200 dark:bg-gray-700 z-10">Nama Ruang</th>
                  {allItemNamesBudhiLuhur.map((itemName) => (
                    <th key={itemName} className="p-2 border border-gray-300 dark:border-gray-600">
                      <div className="text-xs whitespace-nowrap">{itemName}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wismaBudhiLuhur.map((room) => (
                  <tr key={room} className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-300 dark:border-gray-600">
                      {room}
                    </td>
                    {allItemNamesBudhiLuhur.map((itemName) => (
                      <td key={itemName} className="p-2 text-center border border-gray-300 dark:border-gray-600">
                        {roomInventoryData[room]?.[itemName] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}