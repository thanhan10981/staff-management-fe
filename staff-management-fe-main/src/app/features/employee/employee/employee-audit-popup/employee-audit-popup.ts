import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";
import { AuditLogService } from '../../../../service/audit-log.service';


@Component({
  selector: 'app-employee-audit-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-audit-popup.html',
  styleUrls: ['./employee-audit-popup.scss']
})
export class EmployeeAuditPopup {
  @Input() employeeId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  logs: any[] = [];

  constructor(private auditService: AuditLogService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
  this.auditService.getLogsByEmployee(this.employeeId)
    .subscribe(data => {
      this.logs = data;   
    });
}

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

  if (tabId === 'personal') this.closeAll.emit('employee');
  if (tabId === 'certificate') this.closeAll.emit('certificate');
  if (tabId === 'health') this.closeAll.emit('health');
  if (tabId === 'schedule') this.closeAll.emit('schedule');
  if (tabId === 'salary') this.closeAll.emit('salary');
  if (tabId === 'audit') this.closeAll.emit('audit');
}


  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  
}
