import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuditLogService } from '../../../service/audit-log.service';
import { AuditLog } from '../../../model/profile.model';

@Component({
  selector: 'app-log-nearly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './LogNearly.component.html',
  styleUrls: ['./LogNearly.component.scss']
})
export class LogNearlyComponent implements OnInit {

  logs$!: Observable<AuditLog[]>;

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.logs$ = this.auditLogService.recentLogs$;
    this.auditLogService.loadRecentLogs();
  }

  getStatusClass(status: string): string {
    return status === 'ThanhCong' ? 'success' : 'fail';
  }

  getDotClass(log: AuditLog): string {
  if (log.trangThai === 'ThanhCong') {
    return 'dot success';
  }
  return 'dot fail';
}

}
