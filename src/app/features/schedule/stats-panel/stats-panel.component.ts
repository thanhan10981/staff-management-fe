import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../../service/schedule.service';
import { format } from 'date-fns';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.scss']
})
export class StatsPanelComponent implements OnInit, OnChanges {
  @Input() maKhoa!: number;
  @Input() from!: Date;
  @Input() to!: Date;

  stats = {
    total: 0,       // Tổng ca
    withShifts: 0,  // Nhân viên có lịch
    missing: 0,     // Ca thiếu người
    conflicts: 0    // Ca xung đột
  };

  loading = false;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnChanges(): void {
    this.loadStats();
  }

  private formatDate(d: Date) {
    return format(d, 'yyyy-MM-dd');
  }

  private getYearMonth() {
    const year = this.from.getFullYear();
    const month = this.from.getMonth() + 1;
    return { year, month };
  }

  loadStats() {
    if (!this.maKhoa || !this.from || !this.to) return;

    this.loading = true;

    const { year, month } = this.getYearMonth();

    forkJoin({
      totalShifts: this.scheduleService.getTotalShifts(
        this.maKhoa,
        this.formatDate(this.from),
        this.formatDate(this.to)
      ),
      employees: this.scheduleService.getEmployeesWithShifts(
        this.maKhoa,
        year,
        month
      ),
      monthlyStats: this.scheduleService.getMonthlyShiftStats(
        this.maKhoa,
        year,
        month
      )
    }).subscribe({
      next: (res: any) => {
        // Tổng ca = chiều dài list lịch trực trả về
        this.stats.total = Array.isArray(res.totalShifts) ? res.totalShifts.length : 0;

        // Nhân viên có lịch = totalEmployees
        this.stats.withShifts = res.employees?.totalEmployees ?? 0;

        // Ca thiếu người + xung đột
        this.stats.missing = res.monthlyStats?.thieuNguoi ?? 0;
        this.stats.conflicts = res.monthlyStats?.xungDot ?? 0;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
