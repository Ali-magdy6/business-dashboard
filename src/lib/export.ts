import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  title?: string;
}

export const exportToCSV = (data: any[], filename = 'export.csv'): void => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToExcel = (
  data: any[],
  options: ExportOptions = {}
): void => {
  const { filename = 'export.xlsx', sheetName = 'Sheet1' } = options;
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, filename);
};

export const exportToPDF = (
  data: any[],
  columns: string[],
  options: ExportOptions = {}
): void => {
  const { filename = 'export.pdf', title = 'Export' } = options;
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  // Add table
  (doc as any).autoTable({
    head: [columns],
    body: data.map(row => columns.map(col => row[col] || '')),
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
  });
  
  doc.save(filename);
};

export const exportToJSON = (data: any[], filename = 'export.json'): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const getExportFilename = (type: string, prefix = 'export'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${type}`;
};
