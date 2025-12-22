import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../service/employees';
import { DepartmentService } from '../../../service/Department.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { LichTrucTuanDTO } from '../../../model/model';
import { ScheduleService } from '../../../service/schedule.service';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-schedule-employee-report-popup',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './schedule-employee-report-popup.html',
  styleUrl: './schedule-employee-report-popup.scss',
})
export class ScheduleEmployeeReportPopup implements OnInit {

  @Output() close = new EventEmitter<void>();

  originalData: LichTrucTuanDTO[] = [];
  weekDates: string[] = [];
  data: LichTrucTuanDTO[] = [];
  listKhoa: any[] = [];
  listPhongBan: any[] = [];
  listViTri: any[] = [];
  filterTime: 'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH' | 'THIS_YEAR' = 'THIS_WEEK';
  isMonthView: boolean = false;



  // PHẢI inject service
  constructor(
    private scheduleService: ScheduleService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  closePopup() {
    this.close.emit();
  }
// ===== STATS =====
  filterKhoa: string = '';
  filterPhongBan: string = '';
  filterViTri: string = '';
  filterCa: string = '';

  totalShifts = 0;
  thieuNguoi = 0;
  xungDot = 0;
  completionRate = 0;


  ngOnInit(): void {
  this.filterTime = 'THIS_WEEK';
  this.isMonthView = false;

  const { from, to } = this.getCurrentWeek();

  this.buildWeek(from, to);
  this.loadCategories();
  debugger
  this.scheduleService.getLichTuanTheoKhoa(0, from, to).subscribe({
      next: (res: LichTrucTuanDTO[]) => {
        this.originalData = [...res];
        this.data = [...res];
        this.loadStatistics(from, to);
      },
      error: err => console.error(err)
    });
    this.loadStatistics(from, to);
}


  buildWeek(from: string, to: string): void {
    const start = new Date(from);
    const end = new Date(to);

    this.weekDates = [];
    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      this.weekDates.push(d.toISOString().slice(0, 10));
    }
  }

  getShift(emp: LichTrucTuanDTO, date: string): string {
    return emp.lichTheoNgay?.[date] ?? 'Nghỉ';
  }

  // lấy lịch tuần hiện tại 
  private getCurrentWeek(): { from: string; to: string } {
  const today = new Date();

  // getDay(): 0 = CN, 1 = T2, ..., 6 = T7
  const day = today.getDay();

  // ISO week: Thứ 2 là ngày đầu
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: monday.toISOString().slice(0, 10),
    to: sunday.toISOString().slice(0, 10),
  };
}
loadCategories() {
  this.departmentService.getDepartments().subscribe(res => {
    this.listKhoa = res;
  });
   this.departmentService.getAllViTri().subscribe(res => {
    this.listViTri = res;
  });
}

applyFilters(): void {
  const { from, to } = this.getDateRangeByFilter();

  this.buildWeek(from, to);
  this.isMonthView = this.filterTime === 'THIS_MONTH';

  this.loadStatistics(from, to);

  const maKhoa = this.filterKhoa
    ? Number(this.filterKhoa)
    : 0;

  this.scheduleService
    .getLichTuanTheoKhoa(maKhoa, from, to)
    .subscribe(res => {
      let filtered = [...res];

      if (this.filterPhongBan) {
        filtered = filtered.filter(
          e => Number(e.maPhongBan) === Number(this.filterPhongBan)
        );
      }

      if (this.filterViTri) {
        filtered = filtered.filter(
          e => Number(e.maViTri) === Number(this.filterViTri)
        );
      }

      if (this.filterCa) {
        filtered = filtered.filter(e =>
          Object.values(e.lichTheoNgay || {}).includes(this.filterCa)
        );
      }

      this.originalData = [...res];
      this.data = [...filtered];
    });
}



  clearFilters() {
  this.filterKhoa = '';
  this.filterPhongBan = '';
  this.listPhongBan = [];
}

  onKhoaChange() {
  this.filterPhongBan = '';
  this.listPhongBan = [];

  if (!this.filterKhoa) return;

  this.departmentService
    .getPhongBanTheoKhoa(Number(this.filterKhoa))
    .subscribe(res => {
      this.listPhongBan = res;
      console.log('Phòng ban theo khoa:', res);
    });
}


private getDateRangeByFilter(): { from: string; to: string } {
  const today = new Date();

  let from: Date;
  let to: Date;

  switch (this.filterTime) {
    case 'LAST_WEEK': {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      to = new Date(today);
      to.setDate(today.getDate() + diffToMonday - 1);

      from = new Date(to);
      from.setDate(to.getDate() - 6);
      break;
    }

    case 'THIS_MONTH':
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;

    case 'THIS_YEAR':
      from = new Date(today.getFullYear(), 0, 1);
      to = new Date(today.getFullYear(), 11, 31);
      break;

    case 'THIS_WEEK':
    default: {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      from = new Date(today);
      from.setDate(today.getDate() + diffToMonday);

      to = new Date(from);
      to.setDate(from.getDate() + 6);
      break;
    }
  }

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

loadStatistics(from: string, to: string) {

  // reset
  this.totalShifts = 0;
  this.thieuNguoi = 0;
  this.xungDot = 0;
  this.completionRate = 0;

  // ==========================
  // 📅 TUẦN (THIS / LAST WEEK)
  // ==========================
  if (this.filterTime === 'THIS_WEEK' || this.filterTime === 'LAST_WEEK') {

    let total = 0;

    this.data.forEach(emp => {
      Object.values(emp.lichTheoNgay || {}).forEach(ca => {
        if (ca && ca !== 'Nghỉ') {
          total++;
        }
      });
    });

    this.totalShifts = total;

    // hiện tại BE chưa có thống kê tuần
    this.thieuNguoi = 0;
    this.xungDot = 0;

    this.calculateCompletion();
    return;
  }

  
  const maKhoa = this.filterKhoa ? Number(this.filterKhoa) : 0;
  const fromDate = new Date(from);
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth() + 1;

  // Tổng ca tháng
  this.scheduleService
    .getTotalShifts(maKhoa, from, to)
    .subscribe((res: any[]) => {
      this.totalShifts = res.length;
      this.calculateCompletion();
    });

  // Thiếu người / xung đột
  this.scheduleService
    .getMonthlyShiftStats(maKhoa, year, month)
    .subscribe((res: any) => {
      this.thieuNguoi = res.thieuNguoi ?? 0;
      this.xungDot = res.xungDot ?? 0;
      this.calculateCompletion();
    });
}

calculateCompletion() {
  if (this.totalShifts === 0) {
    this.completionRate = 0;
    return;
  }

  const lỗi = this.thieuNguoi + this.xungDot;
  const hopLe = Math.max(this.totalShifts - lỗi, 0);

  this.completionRate = Math.round(
    (hopLe / this.totalShifts) * 1000
  ) / 10; 
}

exportExcel() {
  const rows: any[] = [];

  // ===== Header =====
  const header = ['Nhân viên', ...this.weekDates.map(d =>
    new Date(d).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    })
  )];

  rows.push(header);

  // ===== Data =====
  this.data.forEach(emp => {
    const row = [
      emp.hoTen,
      ...this.weekDates.map(d => this.getShift(emp, d))
    ];
    rows.push(row);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lich truc');

  XLSX.writeFile(
    workbook,
    `bao-cao-lich-truc-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

printPDF() {
  const content = document.getElementById('pdf-report')?.innerHTML;
  if (!content) return;

  const win = window.open('', '', 'width=1400,height=900');
  win!.document.write(`
    <html>
      <head>
        <title>Báo cáo lịch trực</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
          th { background: #6d28d9; color: white; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

  win!.document.close();
  win!.focus();
  win!.print();
}


}
