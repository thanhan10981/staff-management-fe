import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../service/profile.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() closePopup = new EventEmitter<void>();

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  matKhauHienTai = '';
  matKhauMoi = '';
  xacNhanMatKhau = '';

  loading = false;
  errorMsg = '';

  passwordRules = {
    length: false,
    upperLower: false,
    numberSpecial: false
  };

  confirmMatch = true;

  constructor(private profileService: ProfileService) {}

  close() {
    this.isOpen = false;
    this.resetForm();
    this.closePopup.emit();
  }

  resetForm() {
    this.matKhauHienTai = '';
    this.matKhauMoi = '';
    this.xacNhanMatKhau = '';
    this.errorMsg = '';
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.resetForm();          // 🔥 DÒNG QUYẾT ĐỊNH
      this.showCurrent = false;
      this.showNew = false;
      this.showConfirm = false;
      this.confirmMatch = true;
      this.passwordRules = {
        length: false,
        upperLower: false,
        numberSpecial: false
      };
    }
  }

  doiMatKhau() {
    this.validatePassword();

    if (!this.isFormValid()) {
      this.errorMsg = 'Vui lòng kiểm tra lại thông tin';
      return;
    }

    this.loading = true;

    this.profileService.doiMatKhau({
      matKhauHienTai: this.matKhauHienTai,
      matKhauMoi: this.matKhauMoi,
      xacNhanMatKhau: this.xacNhanMatKhau
    }).subscribe({
      next: () => {
        alert('Đổi mật khẩu thành công');
        this.close();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Mật khẩu hiện tại không đúng';
        this.loading = false;
      }
    });
  }

  validatePassword() {
    const pwd = this.matKhauMoi || '';
    this.passwordRules.length = pwd.length >= 8;
    this.passwordRules.upperLower = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
    this.passwordRules.numberSpecial = /\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd);
    this.checkConfirmMatch();
  }

  checkConfirmMatch() {
    this.confirmMatch =
      !this.xacNhanMatKhau || this.matKhauMoi === this.xacNhanMatKhau;
  }

  isFormValid(): boolean {
    return (
      !!this.matKhauHienTai &&
      !!this.matKhauMoi &&
      !!this.xacNhanMatKhau &&
      this.passwordRules.length &&
      this.passwordRules.upperLower &&
      this.passwordRules.numberSpecial &&
      this.confirmMatch
    );
  }
}
