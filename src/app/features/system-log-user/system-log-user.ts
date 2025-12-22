import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../service/audit-log.service';
import { SystemLog } from '../../model/model';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-log-user',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './system-log-user.html',
  styleUrl: './system-log-user.scss',
})
export class SystemLogUser implements OnInit {

  logs: SystemLog[] = [];
  filteredLogs: SystemLog[] = [];

  filterRole = '';
  filterDate = '';

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.auditLogService.getAllLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.filteredLogs = [...data];
      },
      error: (err) => {
        console.error('Lỗi lấy audit log:', err);
      }
    });
  }

  applyFilter() {
    this.filteredLogs = this.logs.filter(log => {

      const matchRole =
        !this.filterRole || log.vaiTro === this.filterRole;

      const matchDate =
        !this.filterDate ||
        log.thoiGian.startsWith(this.filterDate);

      return matchRole && matchDate;
    });
  }
}
