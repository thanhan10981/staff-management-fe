import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeCertificatePopup } from "../employee-certificate-popup/employee-certificate-popup";
import { CommonTabs } from "../common-tabs/common-tabs";
import { EmployeeHealthPopup } from "../employee-health-popup/employee-health-popup";
import { NgZone } from '@angular/core';
import { EmployeeSchedulePopup } from "../employee-schedule-popup/employee-schedule-popup";
import { EmployeeSalaryPopup } from '../employee-salary-popup/employee-salary-popup';
import { EmployeeAuditPopup } from "../employee-audit-popup/employee-audit-popup";
import { EmployeeModel } from '../../../model/model';



@Component({
  selector: 'app-employee-detail-popup',
  standalone:true,
  imports: [CommonModule, EmployeeCertificatePopup, CommonTabs, EmployeeHealthPopup, EmployeeSchedulePopup, EmployeeSalaryPopup, EmployeeAuditPopup],
  templateUrl: './employee-detail-popup.html',
  styleUrl: './employee-detail-popup.scss',
})
export class EmployeeDetailPopup {
   @Input() employee!: EmployeeModel;
  @Output() close = new EventEmitter<void>();
  constructor(private zone: NgZone) {}

  closePopup(){
    this.close.emit();
  }
  // pop up chứng chỉ hành nghề
  showCertificatePopup = false;

openCertificatePopup() {
  setTimeout(() => {
    this.showCertificatePopup = true;
    console.log(' [Detail] showCertificatePopup = true');
  }, 0);
}


closeCertificatePopup() {
  this.showCertificatePopup = false;
}


// 
tabList = [
  { label: 'Thông tin cá nhân', id: 'personal' },
  { label: 'Chứng chỉ hành nghề', id: 'certificate' },
  { label: 'Tiêm chủng sức khỏe', id: 'health' },
  { label: 'Phân công lịch trực', id: 'schedule' },
  { label: 'Lương & phụ cấp', id: 'salary' },
  { label: 'Audit log', id: 'audit' }
];

activeTab = 'personal';

onTabChange(tabId: string) {
  this.activeTab = tabId;
  console.log('[Detail] Tab changed to:', tabId);

  // Mở popup chứng chỉ
  if (tabId === 'certificate') {
    this.openCertificatePopup();
  }

  // 👇 Thêm phần này để mở trực tiếp popup Tiêm chủng
  if (tabId === 'health') {
    this.openHealthPopup();
  }
  if (tabId === 'schedule') {
    this.openSchedulePopup();
  }
  if (tabId === 'salary') {
    this.openSalaryPopup();
  }
  if (tabId === 'audit') {
    this.openAuditPopup();
  }
}


// pop up tiêm chủng
showHealthPopup = false;

openHealthPopup() {
  this.showCertificatePopup = false;
  this.showHealthPopup = true;
  console.log(' Mở popup Tiêm chủng sức khỏe');
}

closeHealthPopup() {
  this.showHealthPopup = false;
}

// pop up lịch
showSchedulePopup = false;

openSchedulePopup() {
  this.showSchedulePopup = true;
  this.showCertificatePopup = false;
  this.showHealthPopup = false;
}



// pop up tiền lương
showSalaryPopup = false;
openSalaryPopup() {
  this.showSalaryPopup = true;
  this.showCertificatePopup = false;
  this.showHealthPopup = false;
  this.showSchedulePopup = false;
}

// pop up audit-log
showAuditPopup = false;

openAuditPopup() {
  this.showAuditPopup = true;
  this.showCertificatePopup = false;
  this.showHealthPopup = false;
  this.showSchedulePopup = false;
  this.showSalaryPopup = false;
}

closeAllPopup(target?: string) {
  this.showCertificatePopup = false;
  this.showHealthPopup = false;
  this.showSchedulePopup = false;
  this.showSalaryPopup = false;
  this.showAuditPopup = false;

  if (target === 'audit') this.openAuditPopup();
  else if (target === 'salary') this.openSalaryPopup();
  else if (target === 'schedule') this.openSchedulePopup();
  else if (target === 'health') this.openHealthPopup();
  else if (target === 'certificate') this.openCertificatePopup();
  else if (target === 'employee') this.closePopup();
}
}
