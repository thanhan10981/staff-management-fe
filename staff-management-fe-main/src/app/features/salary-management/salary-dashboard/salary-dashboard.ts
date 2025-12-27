import { Component,NgZone, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { SalaryDashboardService } from '../../../service/salary-dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-salary-dashboard',
   standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './salary-dashboard.html',
  styleUrl: './salary-dashboard.scss',
})
export class SalaryDashboard implements OnInit {

  private chart!: Chart;
showHolidayCoef = false;
holidayCoef = 300;   
weekendCoef = 200;   
isExporting = false;
searchText: string = "";
originalTableData: any[] = [];

  overview: any = {};
  tableData: any[] = [];
  chartData: any = {};
showConfirm = false;
  isProcessing = false;
  currentMonth!: number;
  currentYear!: number;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  constructor(
    private salaryService: SalaryDashboardService,
    private ngZone: NgZone
  ) {}
recentActivities: any[] = [];


  ngOnInit() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    this.loadOverview(month, year);
    this.loadTable(month, year);
    this.loadChart(month, year);
    this.loadRecent();
  }

  // ========== API CALLS ==========

  loadOverview(month: number, year: number) {
    this.salaryService.getOverview(month, year).subscribe((res) => {
      this.overview = res;
    });
  }

  loadTable(month: number, year: number) {
    this.salaryService.getSalaryTable(month, year).subscribe((res) => {
       this.originalTableData = res;  
    this.tableData = res;
    });
  }

  loadChart(month: number, year: number) {
    this.salaryService.getChartStats(month, year).subscribe((res) => {
      this.chartData = res;
      this.renderChart();
    });
  }

  // ========== CHART ==========

  private renderChart(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => this.initChart(), 30);
      });
    });
  }

  private initChart(): void {
  const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (this.chart) this.chart.destroy();

  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.chartData.days,
      datasets: [
        {
          label: 'Tổng giờ làm',
          data: this.chartData.onTime,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.12)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
        },
        {
          label: 'Tổng tiền OT',
          data: this.chartData.late,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.12)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
onClickCalculate() {
    const now = new Date();
    this.currentMonth = now.getMonth() + 1;
    this.currentYear = now.getFullYear();
    this.showConfirm = true;
  }

  cancelCalculate() {
    this.showConfirm = false;
    this.isProcessing = false;
  }

  confirmCalculate() {
    this.isProcessing = true;

    this.salaryService.calculateSalary(this.currentMonth, this.currentYear)
      .subscribe({
        next: () => {
          this.isProcessing = false;
          this.showConfirm = false;
          this.showToast(`Đã tính lương tháng ${this.currentMonth}/${this.currentYear}!`, 'success');

          this.loadOverview(this.currentMonth, this.currentYear);
          this.loadTable(this.currentMonth, this.currentYear);
          this.loadChart(this.currentMonth, this.currentYear);
        },
        error: () => {
          this.isProcessing = false;
          this.showToast('Có lỗi xảy ra khi tính lương!', 'error');
        }
      });
  }

private showToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.toastVisible = false;
      });
    }, 3000);
  });
}

  saveHolidayCoef() {
  this.salaryService.updateHolidayCoef(this.holidayCoef, this.weekendCoef)
    .subscribe({
      next: () => {
        this.showHolidayCoef = false;
        this.showToast("Đã cập nhật hệ số lễ tết!", 'success');
      },
      error: () => {
        this.showToast("Có lỗi xảy ra khi cập nhật hệ số!", 'error');
      }
    });
}
exportSalaryFile() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  this.isExporting = true; // 🟦 Bật loading

  this.salaryService.exportSalary(month, year).subscribe({
    next: (blob) => {
      this.isExporting = false; // 🟩 Tắt loading

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salary_${month}-${year}.xlsx`;
      a.click();
      this.showToast("Xuất bảng lương thành công!", "success");
    },
    error: () => {
      this.isExporting = false; // 🔥 Tắt loading khi lỗi
      this.showToast("Có lỗi xảy ra khi xuất bảng lương!", "error");
    }
  });
}
loadRecent() {
  this.salaryService.getRecentActivities().subscribe({
    next: (res) => {
      this.recentActivities = res;
    },
    error: () => console.error("Không tải được hoạt động gần đây")
  });
}
filterTable() {
  const text = this.searchText.toLowerCase().trim();

  if (!text) {
    this.tableData = [...this.originalTableData]; 
    return;
  }

  this.tableData = this.originalTableData.filter(item =>
    item.tenNhanVien.toLowerCase().includes(text) ||
    item.email.toLowerCase().includes(text) ||
    item.luongCoBan.toString().includes(text) ||
    item.tongLuong.toString().includes(text)
  );
}




}
