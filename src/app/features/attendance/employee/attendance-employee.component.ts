import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService} from '../../../service/attendance.service';
import { QrPopupComponent } from './qr-popup.component';
import { AttendanceHistoryItem, AttendanceServicee } from '../../../service/attendance-e.service';

@Component({
  selector: 'app-attendance-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, QrPopupComponent],
  templateUrl: './attendance-employee.html',
  styleUrls: ['./attendance-employee.scss']
})
export class AttendanceEmployeeComponent implements OnInit {
  private attService = inject(AttendanceServicee);

  showQr = false;
  currentTime = '';
  employee = { id: 1, code: 'NV001', name: 'Nguyễn Văn Admin', position: 'Quản trị viên', department: 'IT' };
  todayRecord: AttendanceHistoryItem | null = null;
  history: AttendanceHistoryItem[] = [];
  isProcessing = false;
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  monthSummary: any = {};

  ngOnInit(): void {
  
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.loadTodayRecord();
    this.loadMonthSummary();
  }

  updateClock(): void {
    this.currentTime = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

loadTodayRecord(): void {
  const today = new Date().toISOString().split('T')[0];

this.todayRecord =
  this.history.find(r => {
    if (!r.workDate) return false;
    const d = new Date(r.workDate).toISOString().split('T')[0];
    return d === today;
  }) || null;

}

 checkinNow(): void {
  console.log('checkinNow clicked', this.todayRecord);
  this.isProcessing = true;

  const now = new Date();
  const maQR = Math.floor(1000 + Math.random() * 9000).toString();

  const payload = {
    maChamCong: 3334,// mô phỏng ko cần thiết
    maLichTruc: 3,  // mô phỏng thay khi có back-end dữ liệu nhân viên               
    maQR: maQR,
    thoiGianVao: now.toISOString(), 
    thoiGianRa: null,
    trangThai: 'Đã check in',           
    thietBi: navigator.userAgent,
    maNV: '3' // lấy mã nhân viên trên server
  };

  this.attService.checkin(payload).subscribe({
    next: (res: string) => {
      this.showToast(res, 'success');
      this.loadTodayRecord();
      this.loadMonthSummary();
      this.isProcessing = false;
    },
    error: (err) => {
      const msg =
        err?.error?.message ||
        err?.error ||
        err?.message ||
        'Lỗi chấm công';
      this.showToast(msg, 'error');
      console.error('checkinNow error', err);
      this.isProcessing = false;
    }
  });
}





  loadMonthSummary(): void {
    const firstDay = `${this.selectedYear}-${this.selectedMonth.toString().padStart(2,'0')}-01`;
    const lastDay = new Date(this.selectedYear, this.selectedMonth, 0).toISOString().split('T')[0];

    this.attService.reportSummary({
      tuNgay: firstDay,
      denNgay: lastDay,
      maNhanVien: this.employee.id
    }).subscribe({
      next: (res) => {
        this.monthSummary.totalDays = res.totalWorkingDays;
        this.monthSummary.present = res.totalWorkingDays - res.lateCount;
        this.monthSummary.late = res.lateCount;
        this.monthSummary.absent = res.absentCount;
        this.monthSummary.leave = 0;
        this.monthSummary.totalHours = 0;
        this.monthSummary.overtime = 0;
      },
      error: (err) => console.error('Lỗi khi tải thống kê tháng', err)
    });
  }

  onMonthChange(month: number) {
    this.selectedMonth = month;
    this.loadMonthSummary();
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.loadMonthSummary();
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed;bottom:30px;right:30px;padding:16px 32px;
      background:${type === 'success' ? '#16a34a' : '#dc2626'};
      color:white;border-radius:16px;z-index:9999;font-weight:700;font-size:16px;
      box-shadow:0 10px 30px rgba(0,0,0,0.2);animation:slideIn 0.4s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  openQr() {
    this.showQr = true;
  }
  
}function normalizeStatusFromBE(status: string | null | undefined): string {
  if (!status) return '-';
  const s = status.toString().trim().toUpperCase();
  if (s === 'PRESENT' || s === 'ON_TIME' || s === 'ONTIME') return 'Có mặt';
  if (s === 'LATE') return 'Đi muộn';
  if (s === 'EARLY') return 'Về sớm';
  if (s === 'ABSENT') return 'Vắng';
  if (s === 'LEAVE' || s === 'HOLIDAY') return 'Nghỉ';
  return status;
}

