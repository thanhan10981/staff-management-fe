import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";

@Component({
  selector: 'app-employee-audit-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-audit-popup.html',
  styleUrls: ['./employee-audit-popup.scss']
})
export class EmployeeAuditPopup {
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  activeTab = 'audit';

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
    console.log('🟦 [Audit] Tab changed to:', tabId);

    if (tabId === 'personal') this.closeAll.emit('employee');
    if (tabId === 'certificate') this.closeAll.emit('certificate');
    if (tabId === 'health') this.closeAll.emit('health');
    if (tabId === 'schedule') this.closeAll.emit('schedule');
    if (tabId === 'salary') this.closeAll.emit('salary');
  }

  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  // 🧾 Dữ liệu nhật ký thay đổi
  logs = [
    {
      action: 'Cập nhật Chứng chỉ hành nghề',
      detail: 'Thêm chứng chỉ Chuyên khoa I – Nội tổng quát',
      date: '10/12/2025',
      time: '14:30',
      user: 'Nguyễn Văn Admin'
    },
    {
      action: 'Cập nhật Chứng chỉ hành nghề',
      detail: 'Thêm chứng chỉ Chuyên khoa I – Nội tổng quát',
      date: '10/12/2025',
      time: '12:30',
      user: 'Nguyễn Văn Admin'
    },
    {
      action: 'Cập nhật Chứng chỉ hành nghề',
      detail: 'Thêm chứng chỉ Chuyên khoa I – Nội tổng quát',
      date: '10/12/2025',
      time: '11:30',
      user: 'Nguyễn Văn Admin'
    }
  ];
}
