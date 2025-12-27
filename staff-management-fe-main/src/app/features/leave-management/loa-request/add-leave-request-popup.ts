import { Component, EventEmitter, Output } from '@angular/core';
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

  employees: any[] = []; // dữ liệu dropdown nhân viên

  leaveRequest = {
    maNhanVien: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    loaiNghi: '',
    lyDo: ''
  };

  constructor(private http: HttpClient) {}

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
    console.log("Gửi BE:", this.leaveRequest);
    this.submit.emit(this.leaveRequest);
  }

  closePopup() {
    this.close.emit();
  }
}
