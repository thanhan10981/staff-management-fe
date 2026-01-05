import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrPopupComponent } from './qr-popup.component';
import { ChamCongToday } from '../../../model/cham-cong.model';
import { ChamCongService } from '../../../service/cham-cong.service';
import { MonthSummary } from '../../../model/attendance-summary.model';

@Component({
  selector: 'app-attendance-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, QrPopupComponent],
  templateUrl: './attendance-employee.html',
  styleUrls: ['./attendance-employee.scss']
})
export class AttendanceEmployeeComponent implements OnInit {

  // ====== CHẤM CÔNG HÔM NAY ======
  todayRecord?: ChamCongToday;
  isProcessing = false;
  showQr = false;

  // ====== ĐỒNG HỒ ======
  currentTime = '';
  timer?: any;

  // ====== THỐNG KÊ THÁNG (FIX LỖI) ======
  monthSummary: MonthSummary = {
    totalDays: 0,
    present: 0,
    late: 0,
    leave: 0,
    absent: 0,
    totalHours: '0h',
    overtime: '0h'
  };

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  // ====== LỊCH SỬ (FIX LỖI history) ======
  history: any[] = [];

  // ====== NHÂN VIÊN (FIX LỖI employee cho QR popup) ======
  employee = {
    name: '',
    position: '',
    department: ''
  };

  constructor(private chamCongService: ChamCongService) {}

  ngOnInit(): void {
    this.loadToday();
    this.startClock();

    
  }

  // ====== API ======
  loadToday() {
    this.chamCongService.getToday().subscribe({
      next: res => this.todayRecord = res,
      error: err => console.error(err)
    });
  }

  checkinNow() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.chamCongService.checkinByButton('WEB').subscribe({
      next: msg => {
        alert(msg);
        this.loadToday();
      },
      error: err => alert(err?.error || 'Không thể chấm công'),
      complete: () => this.isProcessing = false
    });
  }

  // ====== CLOCK ======
  startClock() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    this.currentTime = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // ====== DROPDOWN (FIX LỖI HTML) ======
  onMonthChange(m: number) {
    this.selectedMonth = m;
  }

  onYearChange(y: number) {
    this.selectedYear = y;
  }
}
