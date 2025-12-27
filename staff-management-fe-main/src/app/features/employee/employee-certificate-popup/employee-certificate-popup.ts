import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";
import { EmployeeCertificateService } from '../../../service/employee-certificate.service';

@Component({
  selector: 'app-employee-certificate-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-certificate-popup.html',
  styleUrls: ['./employee-certificate-popup.scss'],
})
export class EmployeeCertificatePopup implements OnChanges {

  @Input() employeeId!: number;      //  Nhận ID nhân viên từ popup cha
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  certificates: any[] = [];
  loading = true;

  constructor(
    private certificateService: EmployeeCertificateService
  ) {}

  // ==========================
  //  LOAD CHỨNG CHỈ KHI employeeId THAY ĐỔI
  // ==========================
  ngOnChanges(changes: SimpleChanges): void {
  console.log(">>> [CERT POPUP] employeeId nhận = ", this.employeeId);

  if (changes['employeeId'] && this.employeeId) {
    this.loadCertificates();
  }
}


  loadCertificates() {
  console.log(">>> [CERT POPUP] gọi API với ID =", this.employeeId);

  this.certificateService.getCertificatesByEmployee(this.employeeId).subscribe({
    next: (data) => {
      console.log(">>> [CERT POPUP] API trả về =", data);
      this.certificates = data;
    }
  });
}


  // ==========================
  // POPUP EVENT
  // ==========================

  closePopup() {
    this.close.emit();
  }

  openEmployeePopup() {
    this.closeAll.emit('employee');
  }

  openHealthPopup() {
    this.closeAll.emit('health');
  }

  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  // ==========================
  // TAB
  // ==========================
  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  activeTab = 'certificate';

  onTabChange(tabId: string) {
    this.activeTab = tabId;
 
    if (tabId === 'personal') this.openEmployeePopup();
    if (tabId === 'health') this.openHealthPopup();
  }

  // ==========================
  // XEM FILE
  // ==========================
  viewFile(fileUrl: string) {
    if (!fileUrl) {
      alert('Không có tệp đính kèm');
      return;
    }
    window.open(`http://localhost:9090/uploads/${fileUrl}`, '_blank');
  }
}
