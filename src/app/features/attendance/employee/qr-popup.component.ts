import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../service/attendance.service';

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

  remainingTime = 300; // 5 phút
  qrData = '';

  constructor(private attService: AttendanceService) {}

  ngOnInit() {
    this.generateQR();
    this.startCountdown();
  }

  startCountdown() {
    const timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(timer);
        this.close.emit();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  generateQR() {
  // employee.id phải tồn tại
  this.attService.generateQR(this.employee.id).subscribe({
    next: (res: any) => {
      // backend trả { token, qrPayload, message }
      this.qrData = res.qrPayload ?? res.token ?? '';
    },
    error: () => alert('Lỗi tạo QR')
  });
}

}
