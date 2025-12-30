import {
  Component,
  EventEmitter,
  Output,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-leave-request-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-leave-request-popup.html',
  styleUrls: ['./add-leave-request-popup.scss'],
})
export class AddLeaveRequestPopup {

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  employees: any[] = [];

  leaveRequest = {
    maNhanVien: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    loaiNghi: '',
    lyDo: ''
  };

  /** TOAST */
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http.get<any[]>('http://localhost:9090/api/NhanVien')
      .subscribe(res => {
        this.employees = res;
      });
  }

  submitForm() {
    // ✅ VALIDATE
    if (
      !this.leaveRequest.maNhanVien ||
      !this.leaveRequest.ngayBatDau ||
      !this.leaveRequest.ngayKetThuc ||
      !this.leaveRequest.loaiNghi
    ) {
      this.showToast('Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    // ✅ SUCCESS
    this.showToast('Gửi yêu cầu nghỉ phép thành công!', 'success');

    setTimeout(() => {
      this.submit.emit(this.leaveRequest);
      this.close.emit();
    }, 400);
  }

  closePopup() {
    this.close.emit();
  }

  /** TOAST */
  private showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.toastVisible = false;
        });
      }, 3000);
    });
  }
}
