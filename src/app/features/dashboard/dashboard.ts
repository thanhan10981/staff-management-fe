import { Component, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements AfterViewInit {
  private chart!: Chart;

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {

    // Chỉ chạy code khi đang ở Browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Dùng NgZone để tránh ảnh hưởng change detection
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => this.initChart(), 50);
      });
    });
  }

  private initChart(): void {
    const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nếu chart cũ tồn tại → xoá trước
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
          {
            label: 'Đi làm đúng giờ',
            data: [42, 38, 35, 52, 48, 43, 31],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.8,
            pointRadius: 3,
            pointBackgroundColor: '#3b82f6'
          },
          {
            label: 'Đi trễ',
            data: [8, 6, 11, 5, 7, 9, 6],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.12)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.8,
            pointRadius: 3,
            pointBackgroundColor: '#f97316'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: 'easeOutQuart' },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#6b7280', stepSize: 10 }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280' }
          }
        },
        plugins: {
          legend: { display: true, labels: { color: '#374151', boxWidth: 12 } },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            padding: 10,
            cornerRadius: 6
          }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });
  }
}
