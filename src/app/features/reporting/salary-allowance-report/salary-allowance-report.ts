import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SalaryReportService } from '../../../service/salary-report.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salary-allowance-report-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-allowance-report.html',
  styleUrls: ['./salary-allowance-report.scss'],
})
export class SalaryAllowanceReportPopupComponent
  implements AfterViewInit, OnDestroy {

  /* ================= OUTPUT ================= */
  @Output() close = new EventEmitter<void>();
  closePopup() {
    this.close.emit();
  }

  /* ================= VIEW CHILD ================= */
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;

  private barChart?: Chart;
  private donutChart?: Chart;

  /* ================= FILTER ================= */
  period: 'month' | 'quarter' | 'year' = 'month';   // 🔥 KHỚP BE
  department?: number;
  role?: string;

  /* ================= DATA ================= */
  kpi: any = {};
  salaryByDepartment: any[] = [];
  salaryStructure: any[] = [];
  employeeSalaries: any[] = [];

  constructor(private salaryService: SalaryReportService) {}

  /* ================= LIFECYCLE ================= */
  ngAfterViewInit() {
    // ⏱ đợi popup animation xong
    setTimeout(() => {
      this.initBarChart();
      this.initDonutChart();
      this.onFilter();
    }, 200);
  }

  ngOnDestroy() {
    this.barChart?.destroy();
    this.donutChart?.destroy();
  }

  /* ================= FILTER ACTION ================= */
 onFilter() {
  let apiPeriod: 'month' | 'year' = 'month';

  if (this.period === 'year') {
    apiPeriod = 'year';
  }

  // ❌ quarter không gửi xuống BE
  // ✅ map quarter -> month
  if (this.period === 'quarter') {
    apiPeriod = 'month';
  }

  this.loadReportWithPeriod(apiPeriod);
}


  /* ================= LOAD ALL ================= */
 loadReportWithPeriod(period: 'month' | 'year') {

  this.salaryService
    .getKpiLuong(period, this.department, this.role)
    .subscribe(res => this.kpi = res || {});

  this.salaryService
    .getQuyLuongTheoPhongBan(period, this.department, this.role)
    .subscribe(res => {
      console.log('BAR DATA:', res); // 👈 TEST
      this.salaryByDepartment = res || [];
      this.reloadBarChart();
    });

  this.salaryService
    .getCoCauLuong(period, this.department)
    .subscribe(res => {
      this.salaryStructure = res || [];
      this.reloadDonutChart();
    });

  this.salaryService
    .getBangLuongNhanVien(period, this.department, this.role)
    .subscribe(res => this.employeeSalaries = res || []);
}
formatNumber(value: number | undefined): string {
  if (!value) return '0';
  return value.toLocaleString('vi-VN');
}

formatMoney(value: number | undefined): string {
  if (!value) return '0 VND';

  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + ' tỷ VND';
  }

  if (value >= 1_000_000) {
    return Math.round(value / 1_000_000) + ' triệu VND';
  }

  return value.toLocaleString('vi-VN') + ' VND';
}


  /* =====================================================
     BAR CHART – QUỸ LƯƠNG THEO PHÒNG BAN
     ===================================================== */
  private initBarChart() {
    const ctx = this.barChartRef.nativeElement.getContext('2d')!;
    this.barChart?.destroy();

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Quỹ lương',
          data: [],
          backgroundColor: '#a5b4fc',
          borderRadius: 6,
          barThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 900,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => `${v}`
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private reloadBarChart() {
  if (!this.barChart) return;

  // ✅ ĐÚNG KEY TỪ API
  this.barChart.data.labels =
    this.salaryByDepartment.map(d => d.tenPhongBan);

  // reset về 0 để animate
  this.barChart.data.datasets[0].data =
    this.salaryByDepartment.map(() => 0);

  this.barChart.update();

  setTimeout(() => {
    this.barChart!.data.datasets[0].data =
      this.salaryByDepartment.map(d => d.soTien);
    this.barChart!.update();
  }, 120);
}


  /* =====================================================
     DONUT CHART – CƠ CẤU LƯƠNG
     ===================================================== */
  private initDonutChart() {
    const ctx = this.donutChartRef.nativeElement.getContext('2d')!;
    this.donutChart?.destroy();

    const centerTextPlugin = {
      id: 'centerText',
      afterDraw(chart: any) {
        const data = chart.data.datasets[0].data;
        if (!data.length) return;

        const total = data.reduce((a: number, b: number) => a + b, 0);

        chart.ctx.save();
        chart.ctx.font = '700 22px Inter';
        chart.ctx.fillStyle = '#111827';
        chart.ctx.textAlign = 'center';
        chart.ctx.textBaseline = 'middle';
        chart.ctx.fillText(
          Math.round(total).toString(),
          chart.width / 2,
          chart.height / 2
        );
        chart.ctx.restore();
      }
    };

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      plugins: [centerTextPlugin],
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: ['#22c55e', '#fb7185', '#a78bfa'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000
        },
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  private reloadDonutChart() {
    if (!this.donutChart) return;

    this.donutChart.data.labels =
      this.salaryStructure.map(s => s.ten);

    this.donutChart.data.datasets[0].data =
      this.salaryStructure.map(() => 0);

    this.donutChart.update();

    setTimeout(() => {
      this.donutChart!.data.datasets[0].data =
        this.salaryStructure.map(s => s.soTien);
      this.donutChart!.update();
    }, 120);
  }
}
