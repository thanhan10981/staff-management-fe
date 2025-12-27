import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../../../service/leave-request.service';

@Component({
  selector: 'app-leave-detail-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-detail-popup.html',
  styleUrls: ['./leave-detail-popup.scss']
})
export class LeaveDetailPopup {

  @Input() data: any;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  constructor(private leaveService: LeaveRequestService) {}

  closePopup() {
    this.close.emit();
  }

  // ✅ MAP ĐÚNG THEO DB
  getStatusClass(status: string): string {
    switch (status) {
      case 'Cho duyet':
        return 'pending';
      case 'Da duyet':
        return 'approved';
      case 'Tu choi':
        return 'rejected';
      default:
        return '';
    }
  }

  // ===== DUYỆT =====
 approve() {
  if (!this.data?.id) {
    alert('Không tìm thấy mã đơn');
    return;
  }

  this.leaveService.approve(this.data.id).subscribe({
    next: () => {
      this.data.trangThai = 'Da duyet';
      this.updated.emit();
      this.close.emit();
    },
    error: err => {
      console.error(err);
      alert('Duyệt thất bại');
    }
  });
}

reject() {
  if (!this.data?.id) {
    alert('Không tìm thấy mã đơn');
    return;
  }

  this.leaveService.reject(this.data.id).subscribe({
    next: () => {
      this.data.trangThai = 'Tu choi';
      this.updated.emit();
      this.close.emit();
    },
    error: err => {
      console.error(err);
      alert('Từ chối thất bại');
    }
  });
}

}
