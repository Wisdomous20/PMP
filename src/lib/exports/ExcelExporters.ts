import type { EquipmentObjectForExports } from "@/lib/types/InventoryManagementTypes";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Helper functions to format the date as "Month Day, Year" (e.g., May 31, 2024)
function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function toExcelFormat(
  departmentName: string,
  asOfDate: Date,
  data: EquipmentObjectForExports[]
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventory Report');

  // --- Define Styles (reusable objects) ---
  const mainFont: Partial<ExcelJS.Font> = { name: 'Calibri', size: 11 };
  const boldStyle: Partial<ExcelJS.Font> = { ...mainFont, bold: true };
  const redBoldStyle: Partial<ExcelJS.Font> = { ...mainFont, bold: true, color: { argb: 'FFFF0000' } }; // Red
  const blackBoldStyle: Partial<ExcelJS.Font> = { ...mainFont, bold: true, color: { argb: 'FF000000' } }; // Black

  const centerAlignment: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle' };
  const leftAlignment: Partial<ExcelJS.Alignment> = { horizontal: 'left', vertical: 'middle' };
  const rightAlignment: Partial<ExcelJS.Alignment> = { horizontal: 'right', vertical: 'middle' };
  const topAlignment: Partial<ExcelJS.Alignment> = { vertical: 'top' }; // For data rows
  const wrapTextAlignment: Partial<ExcelJS.Alignment> = { wrapText: true };

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const financialNumFmt = '#,##0.00';
  const dateNumFmt = 'mm/dd/yyyy';

  // --- Header Section (shifted to start from Column B) ---

  // Row 1
  worksheet.getCell('B1').value = 'CPU-OVPA Form 05';
  worksheet.getCell('B1').alignment = leftAlignment;
  worksheet.getCell('B1').font = mainFont;

  worksheet.getCell('D1').value = 'CENTRAL PHILIPPINE UNIVERSITY';
  worksheet.getCell('D1').font = boldStyle;
  worksheet.getCell('D1').alignment = centerAlignment;
  worksheet.mergeCells('D1:N1'); // Merged across 11 columns (D to N)
  worksheet.getRow(1).height = 18;

  // Row 2
  worksheet.getCell('B2').value = 'Rev.0 May 29, 2024';
  worksheet.getCell('B2').alignment = leftAlignment;
  worksheet.getCell('B2').font = mainFont;

  worksheet.getCell('D2').value = 'OFFICE OF THE VICE PRESIDENT FOR ADMINISTRATION';
  worksheet.getCell('D2').font = boldStyle;
  worksheet.getCell('D2').alignment = centerAlignment;
  worksheet.mergeCells('D2:N2'); // Merged across 11 columns (D to N)
  worksheet.getRow(2).height = 18;

  // Row 3 is empty (spacer)

  // Row 4
  worksheet.getCell('B4').value = 'INVENTORY REPORT';
  worksheet.getCell('B4').font = boldStyle;
  worksheet.getCell('B4').alignment = centerAlignment;
  worksheet.mergeCells('B4:N4'); // Merged across 13 columns (B to N)
  worksheet.getRow(4).height = 18;

  // Row 5
  worksheet.getCell('B5').value = 'As of ' + formatDateForDisplay(asOfDate);
  worksheet.getCell('B5').alignment = centerAlignment;
  worksheet.getCell('B5').font = mainFont;
  worksheet.mergeCells('B5:N5'); // Merged across 13 columns (B to N)
  worksheet.getRow(5).height = 18;

  // Row 6 is empty (spacer)

  // Row 7: DEPARTMENT (Merged with Rich Text in cell B7)
  const departmentCell = worksheet.getCell('B7');
  departmentCell.value = {
    richText: [
      { text: 'DEPARTMENT: ', font: blackBoldStyle },
      { text: departmentName.toUpperCase(), font: redBoldStyle }
    ]
  };
  departmentCell.alignment = leftAlignment; // Horizontal left, vertical middle
  worksheet.mergeCells('B7:N7'); // Merged across 13 columns (B to N)
  worksheet.getRow(7).height = 18;

  // Row 8 is empty (spacer)

  // Row 9: I. EQUIPMENT
  worksheet.getCell('B9').value = 'I. EQUIPMENT';
  worksheet.getCell('B9').font = boldStyle;
  worksheet.getCell('B9').alignment = leftAlignment;
  worksheet.getRow(9).height = 18;


  // --- Table Headers (Row 10, starting from column B) ---
  const tableHeaderRow = worksheet.getRow(10);
  // Value array starts with null for column A, then headers for B through N
  tableHeaderRow.values = [
    null, // Column A (empty)
    'Item No.', 'Qty.', 'Description', 'Brand & Model', 'Serial No.', 'Supplier',
    'Unit Cost', 'Total Cost', 'Date Purchased', 'Date Received',
    'Status (O;D/R;D/S*)', 'Location', 'Remarks',
  ];
  tableHeaderRow.height = 45;
  // Style cells from B10 to N10 (column indices 2 to 14)
  for (let colIdx = 2; colIdx <= 14; colIdx++) {
    const cell = tableHeaderRow.getCell(colIdx);
    cell.font = boldStyle;
    cell.alignment = { ...centerAlignment, ...wrapTextAlignment }; // Horizontal center, vertical middle, wrap
    cell.border = thinBorder;
  }


  // --- Data Rows (starting from row 11, column B) ---
  data.forEach((item, index) => {
    const rowIndex = 11 + index;
    const row = worksheet.getRow(rowIndex);

    // Value array starts with null for column A
    row.values = [
      null, // Column A (empty)
      index + 1, // Item No. (in B)
      `${item.quantity} unit${item.quantity > 1 ? 's' : ''}`, // Qty (in C)
      item.description,
      item.brand,
      item.serialNumber, // Handles newlines if present
      item.supplier,
      item.unitCost,
      item.totalCost,
      item.datePurchased,
      item.dateReceived,
      item.status,
      item.location,
      item.remarks || '',
    ];

    // Apply styles to data cells (from column B to N, which are cell indices 2 to 14)
    const dataCellAlignmentBase = { ...topAlignment }; // Vertical top for all data cells

    row.getCell(2).alignment = { ...centerAlignment, ...dataCellAlignmentBase }; // Item No. (B)
    row.getCell(3).alignment = { ...centerAlignment, ...dataCellAlignmentBase }; // Qty (C)
    row.getCell(4).alignment = { ...leftAlignment, ...dataCellAlignmentBase, ...wrapTextAlignment }; // Description (D)
    row.getCell(5).alignment = { ...leftAlignment, ...dataCellAlignmentBase, ...wrapTextAlignment }; // Brand & Model (E)
    row.getCell(6).alignment = { ...leftAlignment, ...dataCellAlignmentBase, ...wrapTextAlignment }; // Serial No. (F)
    row.getCell(7).alignment = { ...leftAlignment, ...dataCellAlignmentBase }; // Supplier (G)

    row.getCell(8).alignment = { ...rightAlignment, ...dataCellAlignmentBase }; // Unit Cost (H)
    row.getCell(8).numFmt = financialNumFmt;
    row.getCell(9).alignment = { ...rightAlignment, ...dataCellAlignmentBase }; // Total Cost (I)
    row.getCell(9).numFmt = financialNumFmt;

    row.getCell(10).alignment = { ...centerAlignment, ...dataCellAlignmentBase }; // Date Purchased (J)
    row.getCell(10).numFmt = dateNumFmt;
    row.getCell(11).alignment = { ...centerAlignment, ...dataCellAlignmentBase }; // Date Received (K)
    row.getCell(11).numFmt = dateNumFmt;

    row.getCell(12).alignment = { ...centerAlignment, ...dataCellAlignmentBase }; // Status (L)
    row.getCell(13).alignment = { ...centerAlignment, ...dataCellAlignmentBase, ...wrapTextAlignment }; // Location (M)
    row.getCell(14).alignment = { ...leftAlignment, ...dataCellAlignmentBase, ...wrapTextAlignment }; // Remarks (N)

    // Apply font and border to all filled data cells (B to N)
    for (let colIdx = 2; colIdx <= 14; colIdx++) {
      const cell = row.getCell(colIdx);
      cell.font = mainFont; // Standard font for data
      cell.border = thinBorder;
    }
  });

  // --- Column Widths ---
  worksheet.getColumn('A').width = 3;   // Narrow margin column

  worksheet.getColumn('B').width = 8;   // Item No.
  worksheet.getColumn('C').width = 10;  // Qty.
  worksheet.getColumn('D').width = 35;  // Description
  worksheet.getColumn('E').width = 30;  // Brand & Model
  worksheet.getColumn('F').width = 30;  // Serial No.
  worksheet.getColumn('G').width = 25;  // Supplier
  worksheet.getColumn('H').width = 15;  // Unit Cost
  worksheet.getColumn('I').width = 15;  // Total Cost
  worksheet.getColumn('J').width = 14;  // Date Purchased
  worksheet.getColumn('K').width = 14;  // Date Received
  worksheet.getColumn('L').width = 20;  // Status
  worksheet.getColumn('M').width = 20;  // Location
  worksheet.getColumn('N').width = 30;  // Remarks


  // --- Generate and Download File ---
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'inventory-report.xlsx');
  } catch (error) {
    console.error("Error writing Excel buffer: ", error);
    // Handle error appropriately in your application
  }
}
