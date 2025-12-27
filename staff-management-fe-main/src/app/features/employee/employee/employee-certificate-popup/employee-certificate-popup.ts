import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";
import { EmployeeCertificateService } from '../../../../service/employee-certificate.service';


@Component({
  selector: 'app-employee-certificate-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-certificate-popup.html',
  styleUrls: ['./employee-certificate-popup.scss'],
})
export class EmployeeCertificatePopup implements OnChanges {

  @Input() employeeId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  certificates: any[] = [];
  loading = true;

  constructor(private certificateService: EmployeeCertificateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId'] && this.employeeId) {
      this.loadCertificates();
    }
  }

  loadCertificates() {
    this.certificateService.getCertificatesByEmployee(this.employeeId)
      .subscribe(data => {
        this.certificates = data;
      });
  }

  /** NÚT X — ĐÓNG POPUP CHA */
  closePopup() {
    this.close.emit();     // gửi tín hiệu cho cha đóng popup
  }

  /** NÚT TAB — BÁO CHO CHA MỞ POPUP KHÁC */
  onTabChange(tabId: string) {
    this.closeAll.emit(tabId);
  }

  /** FIX LỖI GỌI closeAll() TRONG HTML */
  handleCloseAll() {
    this.closeAll.emit('employee'); // quay về tab personal
  }

  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  activeTab = 'certificate';

  viewFile(fileUrl: string) {
    if (!fileUrl) return alert('Không có tệp đính kèm');
    window.open(`http://localhost:9090/uploads/${fileUrl}`, '_blank');
  }
}
