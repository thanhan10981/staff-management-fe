import { Component, EventEmitter, NgZone, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../service/employees';
import { DepartmentService } from '../../../service/Department.service';

@Component({
  selector: 'app-add-employee-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee-popup.html',
  styleUrls: ['./add-employee-popup.scss'],
})
export class AddEmployeePopup {

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  listKhoa: any[] = [];
  listPhongBan: any[] = [];
  listViTri: any[] = [];

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  selectedContractName: string | null = null;
  selectedContractType: string | null = null;
  avatarPreview: string | null = null;
  selectedAvatarName: string | null = null;
  selectedAvatarType: string | null = null;


  employee = {
    tenNhanVien: '',
    ngaySinh: '',
    gioiTinh: '',
    cccd: '',
    email: '',
    sdt: '',
    ngayVaoLam: '',
    maViTri: null,
    maPhongBan: null,
    maKhoa: null,
    lienHeKhanCap: '',
    sdtLienHeKhanCap: '',
    hopDongFile: '',
    anhDaiDien: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private ngZone: NgZone,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.departmentService.getDepartments().subscribe(res => this.listKhoa = res);
    this.departmentService.getAllPhongBan().subscribe(res => this.listPhongBan = res);
    this.departmentService.getAllViTri().subscribe(res => this.listViTri = res);
  }

      onFileContractSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.employee.hopDongFile = file.name;
        this.selectedContractName = file.name;

        const ext = file.name.split('.').pop()?.toLowerCase();

        if (ext === 'pdf') this.selectedContractType = 'PDF';
        else if (ext === 'doc') this.selectedContractType = 'DOC';
        else if (ext === 'docx') this.selectedContractType = 'DOCX';
        else this.selectedContractType = 'Tệp không hợp lệ';
      }


      onAvatarSelected(event: any) {
      const file = event.target.files[0];
      if (!file) return;

      this.employee.anhDaiDien = file.name;
      this.selectedAvatarName = file.name;

      const ext = file.name.split('.').pop()?.toLowerCase();
      this.selectedAvatarType = ext?.toUpperCase() ?? '';

      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }


  saveEmployee() {
    if (!this.validateForm()) {
    return;  
  }
    this.employeeService.createEmployee(this.employee).subscribe({
      next: () => {
        this.showToast("Thêm nhân viên thành công!", "success");

        // Gửi tín hiệu lên component cha sau khi thêm thành công
        setTimeout(() => {
          this.saved.emit();
          this.close.emit();
        }, 400); // đóng popup sau 0.4s để toast hiển thị mượt
      },
      error: () => {
        this.showToast("Lỗi! Không thể thêm nhân viên.", "error");
      }
    });
  }

  closePopup() {
    this.close.emit();
  }

  
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
  validateForm(): boolean {
  if (!this.employee.tenNhanVien.trim()) {
    this.showToast("Vui lòng nhập họ tên", "error");
    return false;
  }

  if (!this.employee.ngaySinh) {
    this.showToast("Vui lòng chọn ngày sinh", "error");
    return false;
  }

  if (this.employee.gioiTinh === "" || this.employee.gioiTinh === null) {
    this.showToast("Vui lòng chọn giới tính", "error");
    return false;
  }

  if (!this.employee.cccd.trim()) {
    this.showToast("Vui lòng nhập số CCCD/CMND", "error");
    return false;
  }

  // Kiểm tra email
  if (!this.employee.email.trim()) {
    this.showToast("Vui lòng nhập email", "error");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(this.employee.email)) {
    this.showToast("Email không hợp lệ", "error");
    return false;
  }

  // SĐT
  if (!this.employee.sdt.trim()) {
    this.showToast("Vui lòng nhập số điện thoại", "error");
    return false;
  }

  const phonePattern = /^(0|\+84)\d{9}$/;
  if (!phonePattern.test(this.employee.sdt)) {
    this.showToast("Số điện thoại không hợp lệ", "error");
    return false;
  }

  // Ngày vào làm
  if (!this.employee.ngayVaoLam) {
    this.showToast("Vui lòng chọn ngày vào làm", "error");
    return false;
  }

  // Dropdown bắt buộc
  if (!this.employee.maViTri) {
    this.showToast("Vui lòng chọn chức vụ", "error");
    return false;
  }

  if (!this.employee.maPhongBan) {
    this.showToast("Vui lòng chọn phòng ban", "error");
    return false;
  }

  if (!this.employee.maKhoa) {
    this.showToast("Vui lòng chọn khoa", "error");
    return false;
  }

  // Liên hệ khẩn cấp
  if (!this.employee.lienHeKhanCap.trim()) {
    this.showToast("Vui lòng nhập tên liên hệ khẩn cấp", "error");
    return false;
  }

  if (!this.employee.sdtLienHeKhanCap.trim()) {
    this.showToast("Vui lòng nhập SĐT liên hệ khẩn cấp", "error");
    return false;
  }

  if (!phonePattern.test(this.employee.sdtLienHeKhanCap)) {
    this.showToast("Số điện thoại liên hệ khẩn cấp không hợp lệ", "error");
    return false;
  }

  // File hợp đồng
  if (!this.employee.hopDongFile) {
    this.showToast("Vui lòng chọn file hợp đồng", "error");
    return false;
  }

  // Ảnh đại diện
  if (!this.employee.anhDaiDien) {
    this.showToast("Vui lòng chọn ảnh đại diện", "error");
    return false;
  }

  return true;
}

}
