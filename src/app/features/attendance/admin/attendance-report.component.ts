import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceServicee } from '../../../service/attendance-e.service';

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-report.html',
  styleUrls: ['./attendance-report.scss']
})
export class AttendanceReportComponent {
  stats = { totalEmployees: 0, onTime: 0, late: 0, absent: 0 };
  filter = { month: '2025-11' };

  records: any[] = [];

  constructor(private attService: AttendanceServicee) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
  const [year, month] = this.filter.month.split('-');
  const tuNgay = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const denNgay = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

  this.attService.reportDetail({ tuNgay, denNgay }).subscribe({
    next: (res: any[]) => {
      this.records = res.map((r: any) => ({
        id: r.employeeId,
        name: r.employeeName,
        department: r.departmentName,
        totalDays: r.workingDays,
        lateDays: r.lateCount,
        earlyDays: 0,
        absentDays: r.unpaidLeaveDays,
        rate: r.onTimeRate
      }));

      this.stats.totalEmployees = this.records.length;
      this.stats.late = this.records.reduce((s, r) => s + (r.lateDays || 0), 0);
      this.stats.absent = this.records.reduce((s, r) => s + (r.absentDays || 0), 0);
      this.stats.onTime = this.records.length
        ? Math.round(this.records.reduce((s, r) => s + (r.rate || 0), 0) / this.records.length)
        : 0;
    },
    error: (err) => {
      console.error('Lỗi khi tải báo cáo', err);
    }
  });
}


  exportExcel() {
    alert('Đã xuất file Excel báo cáo chấm công!');
  }
}
