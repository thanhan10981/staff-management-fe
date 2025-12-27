import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeCertificatePopup } from "../employee-certificate-popup/employee-certificate-popup";
import { CommonTabs } from "../common-tabs/common-tabs";
import { EmployeeHealthPopup } from "../employee-health-popup/employee-health-popup";
import { NgZone } from '@angular/core';
import { EmployeeSchedulePopup } from "../employee-schedule-popup/employee-schedule-popup";
import { EmployeeSalaryPopup } from '../employee-salary-popup/employee-salary-popup';
import { EmployeeAuditPopup } from "../employee-audit-popup/employee-audit-popup";
import { EmployeeModel } from '../../../../model/model';


@Component({
  selector: 'app-employee-detail-popup',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeCertificatePopup,
    CommonTabs,
    EmployeeHealthPopup,
    EmployeeSchedulePopup,
    EmployeeSalaryPopup,
    EmployeeAuditPopup,
  ],
  templateUrl: './employee-detail-popup.html',
  styleUrl: './employee-detail-popup.scss',
})
export class EmployeeDetailPopup {
  @Input() employee!: EmployeeModel;
  @Output() close = new EventEmitter<void>();

  showMainContent = true;
  showCertificatePopup = false;
  showHealthPopup = false;
  showSchedulePopup = false;
  showSalaryPopup = false;
  showAuditPopup = false;

  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  activeTab = 'personal';

  constructor(private zone: NgZone) {}

  closePopup() {
    this.close.emit();
  }

  onTabChange(tabId: string) {
    this.activeTab = tabId;

    // TẮT TẤT CẢ POPUP
    this.showMainContent = false;
    this.showCertificatePopup = false;
    this.showHealthPopup = false;
    this.showSchedulePopup = false;
    this.showSalaryPopup = false;
    this.showAuditPopup = false;

    switch (tabId) {
      case 'certificate':
        this.showCertificatePopup = true;
        break;
      case 'health':
        this.showHealthPopup = true;
        break;
      case 'schedule':
        this.showSchedulePopup = true;
        break;
      case 'salary':
        this.showSalaryPopup = true;
        break;
      case 'audit':
        this.showAuditPopup = true;
        break;
      case 'personal':
        this.showMainContent = true;
        break;
    }
  }

  // Nhận tín hiệu từ popup con
  closeAllPopup(target?: string) {
    this.showCertificatePopup = false;
    this.showHealthPopup = false;
    this.showSchedulePopup = false;
    this.showSalaryPopup = false;
    this.showAuditPopup = false;

    // Popup con muốn đóng popup cha
    if (target === 'employee') {
      this.closePopup();
      return;
    }

    if (target) {
      this.onTabChange(target); // mở popup đúng tab
    }
  }
}
