import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { LeaveFilterBarComponent } from './Leave-FilterBar/Leave-FilterBar.component';
import {LeaveStatsPanelComponent} from './Leave-StatsPanel/Leave-StatsPanel.component';
import {LeaveExportBarComponent} from './Leave-ExportBar/Leave-ExportBar.component';
import {LeaveDetailComponent} from './Leave-Detail/Leave-Detail.component';
// (sau này import thêm StatsPanel, Detail, ExportBar)

export interface LeaveFilter {
  period: 'THANG_NAY' | 'QUY_NAY' | 'NAM_NAY';
  phongBanId?: number | null;
  loaiNghi?: string | null;
}

@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [
    CommonModule,
    LeaveFilterBarComponent,
    LeaveStatsPanelComponent,
    LeaveExportBarComponent,
    LeaveDetailComponent
  ],
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.scss']
})
export class LeaveReportComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  // ======================
  // STATE
  // ======================

  currentFilter!: LeaveFilter;

  // Thống kê card (map cho StatsPanel)
    stats = {
    tongNghiPhepNam: 0,
    tongNghiBenh: 0,
    tongNghiKhongLuong: 0
    };


  // Bảng chi tiết
  leaveDetails: any[] = [];

  loading = false;

  constructor(private http: HttpClient) {}

  // ======================
  // INIT
  // ======================

  ngOnInit(): void {
    // filter mặc định giống UI
    this.currentFilter = {
      period: 'THANG_NAY',
      phongBanId: null,
      loaiNghi: null
    };

    this.loadData();
  }

  // ======================
  // EVENT FROM FILTER BAR
  // ======================

    onFilterChange(filter: LeaveFilter) {
    this.currentFilter = filter;
    this.loadData();
    }


  // ======================
  // LOAD DATA
  // ======================

loadData() {
  this.loading = true;
  this.loadStats(this.currentFilter);
  this.loadLeaveDetails(this.currentFilter);
}

  // ======================
  // API CALLS
  // ======================

  loadStats(filter: LeaveFilter) {
  const bodyBase: any = {
    timeRange: filter.period,
    maPhongBan: filter.phongBanId ?? null
    
  };

  // CARD 1 – Nghỉ phép năm
  this.http.post<any>(
    'http://localhost:9090/api/leave-statistic/total-annual-leave',
    bodyBase
  ).subscribe(res => {
    this.stats.tongNghiPhepNam = res.tongNgayNghiPhepNam;
  });

  // CARD 2 – Nghỉ bệnh
  this.http.post<any>(
    'http://localhost:9090/api/leave-statistic/total-sick-leave',
    bodyBase
  ).subscribe(res => {
    this.stats.tongNghiBenh = res.totalSickLeaveDays;
  });

  // CARD 3 – Không lương
  this.http.post<any>(
    'http://localhost:9090/api/leave-statistic/unpaid-total',
    {
      timeRange: filter.period,
      maPhongBan: filter.phongBanId ?? null,
      tenPhongBan: null
    }
  ).subscribe(res => {
    this.stats.tongNghiKhongLuong = res.tongNgayNghiKhongLuong;
  });
}

private loadLeaveDetails(filter: LeaveFilter) {
  this.http.post<any[]>(
    'http://localhost:9090/api/leave-overview',
    {
      timeRange: filter.period,
      maPhongBan: filter.phongBanId ?? null,
      tenPhongBan: null
    }
  ).subscribe(res => {
    this.leaveDetails = res;
  });
}


  // ======================
  // EXPORT (gắn cho ExportBar sau)
  // ======================

  get totalDays(): number {
  return (
    this.stats.tongNghiPhepNam +
    this.stats.tongNghiBenh +
    this.stats.tongNghiKhongLuong
  );
}

  exportExcel() {
    console.log('Export Excel với filter:', this.currentFilter);
  }

  exportPdf() {
    console.log('Export PDF với filter:', this.currentFilter);
  }
}
