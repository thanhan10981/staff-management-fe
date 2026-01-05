import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../service/attendance.service';
import { AttendanceServicee } from '../../../service/attendance-e.service';
import { ChamCongService } from '../../../service/cham-cong.service';
@Component({
  selector: 'app-qr-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-popup.html',
  styleUrls: ['./qr-popup.scss']
})
export class QrPopupComponent {

  @Input() employee: any;
  @Output() close = new EventEmitter<void>();

  qrData = '';
  remainingTime = 300;
  timer?: any;
  checkinResult?: {
    thoiGian: string;
    trangThai: string;
    thietBi: string;
  };

  currentLocation = '';


  constructor(private chamCongService: ChamCongService) {}

  ngOnInit() {
    this.createQR();
    this.startCountdown();
  }

  createQR() {
  this.chamCongService.createQR().subscribe({
    next: res => {
      this.qrData = res.maQRCode;   // ✅ LẤY QR THẬT
      this.remainingTime = 300;
      this.startCountdown();
    },
    error: err => {
      console.error(err);
      alert('Không tạo được QR');
    }
  });
}



  startCountdown() {
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /** Khi quét QR (mobile hoặc giả lập) */
  submitQR() {
    this.chamCongService.checkinByQR({
      maQRCode: this.qrData,
      thietBi: 'MOBILE'
    }).subscribe({
      next: res => {
        this.checkinResult = res;
        this.getLocation();
      },
      error: err => alert(err?.error || 'QR không hợp lệ')
    });
  }
    
    getLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(pos => {
      this.currentLocation =
        `Vĩ độ ${pos.coords.latitude.toFixed(5)}, ` +
        `Kinh độ ${pos.coords.longitude.toFixed(5)}`;
    });
  }

}