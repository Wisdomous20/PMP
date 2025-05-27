import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ArchivePersonnel {
  name: string;
}

interface ArchiveTask {
  name: string;
  startTime: string;
  endTime: string;
  checked: boolean;
  personnel?: ArchivePersonnel[];
}

interface ArchiveSupervisor {
  firstName: string;
  lastName: string;
  email: string;
}

interface ArchiveImplementationPlan {
  serviceRequest?: {
    supervisor?: ArchiveSupervisor;
  };
  tasks?: ArchiveTask[];
}

interface Archive {
  title?: string;
  name?: string;
  department?: string;
  requestDate?: string;
  details?: string;
  implementationPlan?: ArchiveImplementationPlan;
}

export async function createArchiveExcel(archive: Archive) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Archive Details');

  // --- Styles ---
  const mainFont: Partial<ExcelJS.Font> = { name: 'Calibri', size: 11 };
  const boldStyle: Partial<ExcelJS.Font> = { ...mainFont, bold: true };
  const centerAlignment: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle' };
  const leftAlignment: Partial<ExcelJS.Alignment> = { horizontal: 'left', vertical: 'middle' };
  const wrapTextAlignment: Partial<ExcelJS.Alignment> = { wrapText: true };
  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  // --- Header Section ---
  worksheet.getCell('B1').value = 'ARCHIVE DETAILS';
  worksheet.getCell('B1').font = boldStyle;
  worksheet.getCell('B1').alignment = centerAlignment;
  worksheet.mergeCells('B1:F1');
  worksheet.getRow(1).height = 20;

  // --- Archive Info ---
  worksheet.getCell('B3').value = 'Title:';
  worksheet.getCell('B3').font = boldStyle;
  worksheet.getCell('C3').value = archive.title || '';
  worksheet.getCell('B4').value = 'Requestor:';
  worksheet.getCell('B4').font = boldStyle;
  worksheet.getCell('C4').value = archive.name || '';
  worksheet.getCell('B5').value = 'Department:';
  worksheet.getCell('B5').font = boldStyle;
  worksheet.getCell('C5').value = archive.department || '';
  worksheet.getCell('B6').value = 'Request Date:';
  worksheet.getCell('B6').font = boldStyle;
  worksheet.getCell('C6').value = archive.requestDate || '';
  worksheet.getCell('B7').value = 'Concern:';
  worksheet.getCell('B7').font = boldStyle;
  worksheet.getCell('C7').value = archive.title || '';
  worksheet.getCell('B8').value = 'Details:';
  worksheet.getCell('B8').font = boldStyle;
  worksheet.getCell('C8').value = archive.details || '';

  // Supervisor
  if (archive.implementationPlan?.serviceRequest?.supervisor) {
    const s = archive.implementationPlan.serviceRequest.supervisor;
    worksheet.getCell('B9').value = 'Supervisor:';
    worksheet.getCell('B9').font = boldStyle;
    worksheet.getCell('C9').value = `${s.firstName} ${s.lastName} (${s.email})`;
  }

  // --- Tasks Table Header ---
  worksheet.getCell('B11').value = 'Tasks';
  worksheet.getCell('B11').font = boldStyle;
  worksheet.getRow(11).height = 18;

  const tableHeaderRow = worksheet.getRow(12);
  tableHeaderRow.values = [
    null,
    'Task Name',
    'Start Time',
    'End Time',
    'Checked',
    'Assigned Personnel',
  ];
  for (let colIdx = 2; colIdx <= 6; colIdx++) {
    const cell = tableHeaderRow.getCell(colIdx);
    cell.font = boldStyle;
    cell.alignment = { ...centerAlignment, ...wrapTextAlignment };
    cell.border = thinBorder;
  }

  // --- Tasks Data ---
  (archive.implementationPlan?.tasks || []).forEach((task: ArchiveTask, idx: number) => {
    const rowIndex = 13 + idx;
    const row = worksheet.getRow(rowIndex);
    const personnel =
      task.personnel && task.personnel.length > 0
        ? task.personnel.map((p: ArchivePersonnel) => p.name).join('; ')
        : 'No personnel assigned';
    row.values = [
      null,
      task.name,
      task.startTime,
      task.endTime,
      task.checked ? 'Yes' : 'No',
      personnel,
    ];
    for (let colIdx = 2; colIdx <= 6; colIdx++) {
      const cell = row.getCell(colIdx);
      cell.font = mainFont;
      cell.alignment = leftAlignment;
      cell.border = thinBorder;
    }
  });

  // --- Column Widths ---
  worksheet.getColumn('B').width = 20;
  worksheet.getColumn('C').width = 25;
  worksheet.getColumn('D').width = 25;
  worksheet.getColumn('E').width = 10;
  worksheet.getColumn('F').width = 30;

  // --- Download File ---
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${archive.title || 'archive-details'}.xlsx`);
  } catch (error) {
    console.error('Error writing Excel buffer: ', error);
  }
}