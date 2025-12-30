import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { StatsPanelComponent } from './stats-panel/stats-panel.component';
import { AttendanceService } from '../../service/attendance.service';
import { TongNgayCongResponse , TyLeDiTrePhongBanChart , TongLanDiTreResponse, TongNghiKhongPhepResponse, TiLeDungGioResponse, TongNgayCongTheoThangItem } from '../../model/simple-item.model';
import { ChartWorkdaysComponent } from './charts-panel/chart-workdays.component';
import { ChartLateRateComponent } from './chart-late-rate/chart-late-rate.component';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
@Component({
  selector: 'app-attendance-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FilterBarComponent,
    StatsPanelComponent,
    ChartWorkdaysComponent,
    ChartLateRateComponent,
    AttendanceTableComponent
  ],
  templateUrl: './attendance-statistics.component.html',
  styleUrls: ['./attendance-statistics.component.scss']
})
export class AttendanceStatisticsComponent {

    @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
    /** ===== FILTER STATE ===== */
    selectedDate?: string;
    selectedPhongBan?: number;
    selectedViTri?: number;
  /** ===== STATS ===== */
  totalWorkDays = 0;
  lateCount = 0;
  absentWithoutLeave = 0;
  onTimeRate = 0;

  /** ===== DATA KHÁC (sau này dùng) ===== */
  charts: any;
  tableData: any[] = [];
  monthlyWorkdays: any[] = [];
  lateRateData: TyLeDiTrePhongBanChart[] = [];




  constructor(
    private attendanceService: AttendanceService
  ) {}

  onFilterChange(filter: {
    specificDate: string | null;
    timeRange: string | null;
    departmentId: number | null;
    positionId: number | null;
  }) {
    console.log('Filter changed:', filter);

    this.selectedDate = filter.specificDate ?? undefined;
    this.selectedPhongBan = filter.departmentId ?? undefined;
    this.selectedViTri = filter.positionId ?? undefined;

    
    this.loadTongNgayCong(filter);
    this.loadTongLanDiTre(filter);
    this.loadTongNghiKhongPhep(filter);
    this.loadTiLeDungGio(filter);
    this.loadWorkdaysByMonth(filter);
    this.loadLateRate(filter);
  }

  private loadLateRate(filter: any) {
    this.attendanceService.getTyLeDiTre(filter)
      .subscribe({
        next: res => this.lateRateData = res ?? [],
        error: () => this.lateRateData = []
      });
  }

  /** ===== API: TỔNG NGÀY CÔNG ===== */
  private loadTongNgayCong(filter: any) {
    this.attendanceService.getTongNgayCong(filter)
      .subscribe({
        next: (res: TongNgayCongResponse) => {
          this.totalWorkDays = res.tongSoNgayCong;
        },
        error: err => {
          console.error('Lỗi load tổng ngày công', err);
          this.totalWorkDays = 0;
        }
      });
  }

  private loadTongLanDiTre(filter: any) {
  this.attendanceService.getTongLanDiTre(filter)
    .subscribe({
        next: (res: TongLanDiTreResponse) => {
            this.lateCount = res.tongSoLanDiTre;
        },
        error: err => {
            console.error('Lỗi load số lần đi trễ', err);
            this.lateCount = 0;
        }
        });
    }

    private loadTongNghiKhongPhep(filter: any) {
    this.attendanceService.getTongNghiKhongPhep(filter)
        .subscribe({
        next: (res: TongNghiKhongPhepResponse) => {
            this.absentWithoutLeave = res.tongSoNghiKhongPhep;
        },
        error: err => {
            console.error('Lỗi load nghỉ không phép', err);
            this.absentWithoutLeave = 0;
        }
        });
    }

    private loadTiLeDungGio(filter: any) {
    this.attendanceService.getTiLeDungGio(filter)
        .subscribe({
        next: (res: TiLeDungGioResponse) => {
            this.onTimeRate = Math.round(res.tiLeDungGio);
        },
        error: err => {
            console.error('Lỗi load tỷ lệ đúng giờ', err);
            this.onTimeRate = 0;
        }
        });
    }

    private loadWorkdaysByMonth(filter: any) {
    this.attendanceService.getTongNgayCongTheoThang(filter)
        .subscribe({
        next: res => {
            // đảm bảo đủ 12 tháng (phòng khi BE đổi sau này)
            this.monthlyWorkdays = res;
        },
        error: () => this.monthlyWorkdays = [],
        });
    }



}
