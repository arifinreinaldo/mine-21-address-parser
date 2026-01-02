import * as XLSX from 'xlsx';
import { AddressRow } from '@/types';

export function parseExcelFile(file: ArrayBuffer): AddressRow[] {
  const workbook = XLSX.read(file, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<AddressRow>(worksheet);
  return data;
}

export function findAddressColumn(data: AddressRow[]): string | null {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const addressKeywords = ['address', 'alamat', 'jalan', 'jl', 'lokasi', 'location'];

  for (const header of headers) {
    const lowerHeader = header.toLowerCase();
    if (addressKeywords.some(keyword => lowerHeader.includes(keyword))) {
      return header;
    }
  }

  return headers[0];
}

export function generateExcelFile(data: AddressRow[]): Blob {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Addresses');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
