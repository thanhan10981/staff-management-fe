import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EmployeeOption,
  ShiftSwapCreateForm,
  ShiftSwapRequestCreateModel
} from '../../../../model/model';

@Component({
  selector: 'app-add-request-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-request-popup.html',
  styleUrls: ['./add-request-popup.scss'],
})
export class AddRequestPopup implements OnInit {

  /** DATA TỪ CHA */
  @Input() data?: ShiftSwapCreateForm;

  /** DANH SÁCH NHÂN VIÊN (DROPDOWN ĐẦU) */
  @Input() nhanVienList: EmployeeOption[] = [];

  /** EVENT */
  @Output() selectNhanVien = new EventEmitter<number>();
  @Output() submit = new EventEmitter<ShiftSwapRequestCreateModel>();
  @Output() close = new EventEmitter<void>();

  selectedNhanVienId!: number;

  /** FORM */
  form: ShiftSwapRequestCreateModel = {
    nguoiGui: 0,
    nguoiNhan: 0,
    maCa: 0,
    ngayTruc: '',
    lyDo: ''
  };

  /** TOAST */
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  /** Khi chọn nhân viên */
  onNhanVienChange() {
    if (!this.selectedNhanVienId) return;

    this.form.nguoiGui = this.selectedNhanVienId;
    this.selectNhanVien.emit(this.selectedNhanVienId);
  }

  /** Gửi form */
  onSubmit() {
    if (!this.form.nguoiNhan || !this.form.maCa || !this.form.ngayTruc) {
      this.showToast('Vui lòng nhập đủ thông tin', 'error');
      return;
    }

    this.showToast('Tạo yêu cầu đổi ca thành công!', 'success');

    setTimeout(() => {
      this.submit.emit(this.form);
      this.close.emit();
    }, 400);
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
