import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonTabs } from '../common-tabs/common-tabs';
@Component({
  selector: 'app-employee-schedule-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-schedule-popup.html',
  styleUrls: ['./employee-schedule-popup.scss']
})
export class EmployeeSchedulePopup {
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  activeTab = 'schedule';

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
    console.log('🟦 [Schedule] Tab changed to:', tabId);

    if (tabId === 'personal') this.closeAll.emit('employee');
    if (tabId === 'certificate') this.closeAll.emit('certificate');
    if (tabId === 'health') this.closeAll.emit('health');
  }

  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  // Dữ liệu giả lập
  summary = {
    totalShifts: 24,
    totalHours: 192,
    overtime: 8
  };

  weekSchedule = [
    { day: 'T2', shifts: ['Ca sáng', 'Ca chiều'], isOff: false },
    { day: 'T3', shifts: ['Ca sáng', 'Ca tối'], isOff: false },
    { day: 'T4', shifts: ['Ca sáng', 'Ca chiều'], isOff: false },
    { day: 'T5', shifts: ['Ca sáng', 'Ca chiều'], isOff: false },
    { day: 'T6', shifts: ['Ca sáng', 'Ca chiều'], isOff: false },
    { day: 'T7', shifts: ['nghỉ'], isOff: true },
    { day: 'CN', shifts: ['nghỉ'], isOff: true }
  ];
}
