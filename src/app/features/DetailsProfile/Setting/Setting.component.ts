import {Component, Input} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../service/profile.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-setting',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './Setting.component.html',
    styleUrls: ['./Setting.component.scss']
})
export class SettingComponent {
@Input() isOpen = false;
@Output() openPopup = new EventEmitter<void>();
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
open() {
  this.openPopup.emit();
}

close() {
  this.isOpen = false;   // 👈 DÒNG QUYẾT ĐỊNH
  this.resetForm();
  this.closePopup.emit();
}



 
  resetForm() {
    this.profileService.doiMatKhau({
    matKhauHienTai: this.matKhauHienTai.trim(),
    matKhauMoi: this.matKhauMoi.trim(),
    xacNhanMatKhau: this.xacNhanMatKhau.trim()
    })

    this.errorMsg = '';
    this.loading = false;
  }

doiMatKhau() {
  this.validatePassword();

  if (!this.matKhauHienTai || !this.matKhauMoi || !this.xacNhanMatKhau) {
    this.errorMsg = 'Vui lòng nhập đầy đủ thông tin';
    return;
  }

  if (
    !this.passwordRules.length ||
    !this.passwordRules.upperLower ||
    !this.passwordRules.numberSpecial
  ) {
    this.errorMsg = 'Mật khẩu mới chưa đáp ứng yêu cầu';
    return;
  }

  if (!this.confirmMatch) {
    this.errorMsg = 'Xác nhận mật khẩu không khớp';
    return;
  }

  this.loading = true;
  this.errorMsg = '';

  this.profileService.doiMatKhau({
    matKhauHienTai: this.matKhauHienTai,
    matKhauMoi: this.matKhauMoi,
    xacNhanMatKhau: this.xacNhanMatKhau
  }).subscribe({
    next: () => {
      alert('Đổi mật khẩu thành công');
      this.close();
      this.resetForm();
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
  this.passwordRules.upperLower =
    /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
  this.passwordRules.numberSpecial =
    /\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd);

  this.checkConfirmMatch();
}

checkConfirmMatch() {
  this.confirmMatch =
    !this.xacNhanMatKhau ||
    this.matKhauMoi === this.xacNhanMatKhau;
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