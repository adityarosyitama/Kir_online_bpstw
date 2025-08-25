import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

// Define the interface for the CSV row structure
interface CsvRow {
  'Kode URL'?: string;
  Nibar?: string;
  'Nomor Register'?: string;
  'Kode Barang'?: string;
  'Nama Barang'?: string;
  'Spesifikasi Nama Barang'?: string;
  'Merk/Type'?: string;
  'Tahun Perolehan'?: string;
  Jumlah?: string;
  Satuan?: string;
  'Ket.'?: string;
  'Unit Kerja'?: string;
  Ruang?: string;
}

// Define the interface for the mapped output
interface MappedData {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug')?.toLowerCase() || '';

    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'src', 'app', 'database', 'database.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse CSV with explicit typing
    const { data } = Papa.parse<CsvRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Filter data by slug (Kode URL)
    const filteredData = data.filter(
      (row: CsvRow) => row['Kode URL']?.toLowerCase() === slug
    );

    // Map to desired structure
    const mappedData: MappedData[] = filteredData.map((row: CsvRow, index: number) => ({
      noUrut: index + 1,
      nibar: row['Nibar'] || '',
      nomorRegister: row['Nomor Register'] || '',
      kodeBarang: row['Kode Barang'] || '',
      namaBarang: row['Nama Barang'] || '',
      spesifikasiNamaBarang: row['Spesifikasi Nama Barang'] || '',
      merkType: row['Merk/Type'] || '',
      tahunPerolehan: row['Tahun Perolehan'] || '',
      jumlahBarang: parseInt(row['Jumlah'] || '0', 10),
      satuanBarang: row['Satuan'] || '',
      keterangan: row['Ket.'] || '',
      UnitKerja: row['Unit Kerja'] || '',
      Ruang: row['Ruang'] || '',
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { error: 'Failed to load inventory data' },
      { status: 500 }
    );
  }
}