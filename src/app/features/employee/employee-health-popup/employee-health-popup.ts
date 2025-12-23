import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";

@Component({
  selector: 'app-employee-health-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-health-popup.html',
  styleUrls: ['./employee-health-popup.scss']
})
export class EmployeeHealthPopup {
  @Output() close = new EventEmitter<void>();
 @Output() closeAll = new EventEmitter<string>(); // 👈 đổi từ void → string

closeBoth(target: string = '') {
  this.closeAll.emit(target);
}


  closePopup() {
    this.close.emit();
  }


  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  activeTab = 'health';

  onTabChange(tabId: string) {
    this.activeTab = tabId;
    if (tabId === 'personal' || tabId === 'certificate') {
      this.closeBoth(); 
    }
  }

  vaccinations = [
    { name: 'COVID-19 (Pfizer)', date: '10/12/2020', status: 'Hoàn thành' },
    { name: 'COVID-19 (Pfizer)', date: '10/12/2020', status: 'Hoàn thành' },
    { name: 'COVID-19 (Pfizer)', date: '10/12/2020', status: 'Hoàn thành' }
  ];

  healthChecks = [
    { name: 'Khám tổng quát 2024', date: '10/12/2024', hospital: 'Bệnh viện Quy Nhơn', status: 'Bình thường' },
    { name: 'Khám tổng quát 2024', date: '10/12/2024', hospital: 'Bệnh viện Quy Nhơn', status: 'Bình thường' }
  ];
}
