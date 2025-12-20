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
import { Chart } from 'chart.js';
import { DashboardService } from '../../../service/dashboard.service';

@Component({
  selector: 'app-dashbroad-flash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashbroad-flash.html',
  styleUrl: './dashbroad-flash.scss',
})
export class DashbroadFlash implements AfterViewInit, OnDestroy {

  /* ================= OUTPUT ================= */
  @Output() closed = new EventEmitter<void>();
  closePopup() {
    this.closed.emit();
  }

  /* ================= VIEW CHILD ================= */
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salaryDonut') donutChartRef!: ElementRef<HTMLCanvasElement>;

  /* ================= CHART INSTANCE ================= */
  private lineChart!: Chart;
  private donutChart!: Chart<'doughnut'>;
  leaveRate = 0;
  leaveDiff = 0;
  /* ================= LEGEND DATA (🔥 FIX LỖI) ================= */
  salaryLegend: { label: string; value: number }[] = [];

  colors = ['#6366f1', '#22c55e', '#f97316', '#ef4444'];

  constructor(private dashboardService: DashboardService) {}

  /* ================= LIFECYCLE ================= */
  ngAfterViewInit() {
    this.initLineChart();
    this.initDonutChart();
    this.loadRealData();
    this.loadNhanVienStat();
  }
  ngOnInit() {
      this.dashboardService.getTiLeNghiPhep()
        .subscribe(res => {
          this.leaveRate = res.tiLe;
          this.leaveDiff = res.chenhLech;
        });
    }
  ngOnDestroy() {
    this.lineChart?.destroy();
    this.donutChart?.destroy();
  }
  tongNhanVien = 0;
  chenhLechNhanVien = 0;

  private loadNhanVienStat() {
    this.dashboardService.getThongKeNhanVien()
      .subscribe(res => {
        this.tongNhanVien = res.tong;
        this.chenhLechNhanVien = res.chenhLech;
      });
  }

  /* =====================================================
     LINE CHART – NHÂN SỰ THEO THÁNG (KHÔNG BỊ BỎ)
     ===================================================== */
  private initLineChart() {
    const ctx = this.lineChartRef.nativeElement.getContext('2d')!;
    this.lineChart?.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.35)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.05)');

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Nhân sự',
          data: [],
          borderColor: '#7c3aed',
          backgroundColor: gradient,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#7c3aed',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
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
        const { ctx, width, height } = chart;

        ctx.save();
        ctx.font = '700 24px Inter';
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          (total / 1_000_000).toFixed(1) + ' triệu',
          width / 2,
          height / 2
        );
      }
    };

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      plugins: [centerTextPlugin],
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: this.colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { display: false } // ⛔ ẩn legend mặc định
        }
      }
    });
  }

  /* =====================================================
     LOAD DATA THẬT
     ===================================================== */
  private loadRealData() {

    /* 🔵 LINE – NHÂN SỰ */
    this.dashboardService.getNhanVienTheoThang()
      .subscribe(res => {
        this.lineChart.data.labels = res.map(r => `T${r.thang}`);
        this.lineChart.data.datasets[0].data = res.map(r => r.soLuong);
        this.lineChart.update();
      });

    /* 🔵 DONUT – LƯƠNG */
    this.dashboardService.getCoCauLuong()
      .subscribe(res => {

        this.salaryLegend = res.map(r => ({
          label: r.ten,
          value: r.soTien
        }));

        this.donutChart.data.labels = this.salaryLegend.map(i => i.label);
        this.donutChart.data.datasets[0].data = this.salaryLegend.map(i => i.value);

        this.donutChart.update();
      });
  }
}
