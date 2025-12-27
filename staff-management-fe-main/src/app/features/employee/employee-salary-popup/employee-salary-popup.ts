import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";

@Component({
  selector: 'app-employee-salary-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-salary-popup.html',
  styleUrls: ['./employee-salary-popup.scss']
})
export class EmployeeSalaryPopup {
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  activeTab = 'salary';

  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  onTabChange(tabId: string) {
    this.activeTab = tabId;
    console.log('🟦 [Salary] Tab changed to:', tabId);

    if (tabId === 'personal') this.closeAll.emit('employee');
    if (tabId === 'certificate') this.closeAll.emit('certificate');
    if (tabId === 'health') this.closeAll.emit('health');
    if (tabId === 'schedule') this.closeAll.emit('schedule');
  }

  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  salary = {
    base: 15000000,
    shift: 5000000,
    surgery: 3500000,
    hazard: 1000000,
    meal: 1200000,
    other: 500000,
    holiday: 2000000
  };

  summary = {
    total: 28200000,
    tax: 1500000,
    insurance: 2440000,
    deduction: 0,
    net: 23625000
  };
}
