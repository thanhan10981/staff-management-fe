import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";

@Component({
  selector: 'app-employee-certificate-popup',
  standalone:true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-certificate-popup.html',
  styleUrls: ['./employee-certificate-popup.scss'],
})
export class EmployeeCertificatePopup {
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>(); // gửi tín hiệu cho cha

  // ✅ Hàm đóng popup hiện tại
  closePopup() {
    this.close.emit();
  }

  // ✅ Gửi tín hiệu về cha mở popup khác
  openEmployeePopup() {
    console.log('📤 Emit closeAll(employee)');
    this.closeAll.emit('employee');
  }

  openHealthPopup() {
    console.log('📤 Emit closeAll(health)');
    this.closeAll.emit('health');
  }

  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  certificates = [
    {
      name: 'Chứng chỉ Chuyên khoa I – Nội tổng quát',
      code: 'CK1-NTQ-2020-015',
      date: '10/12/2020',
      issuedBy: 'Trường Đại học Y Hà Nội',
      expire: '10/12/2025',
      type: 'new',
      file: '/assets/files/chungchi1.pdf'
    },
    {
      name: 'Chứng chỉ Chuyên khoa I – Nội tổng quát',
      code: 'CK1-NTQ-2020-016',
      date: '10/12/2020',
      issuedBy: 'Trường Đại học Y Hà Nội',
      expire: '10/12/2025',
      type: 'approved',
      file: '/assets/files/chungchi2.pdf'
    }
  ];

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
    console.log('🟦 [Certificate] Tab changed to:', tabId);

    if (tabId === 'personal') {
      this.openEmployeePopup(); // quay lại popup nhân viên
    }

    if (tabId === 'health') {
      this.openHealthPopup(); // mở popup tiêm chủng
    }
  }

  viewFile(fileUrl: string) {
    if (!fileUrl) {
      alert('Không có tệp đính kèm');
      return;
    }
    window.open(fileUrl, '_blank');
  }
}
