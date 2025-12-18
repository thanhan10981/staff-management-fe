import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// ⭐ Đăng ký plugin đúng cho Chart.js 3
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-dashbroad-flash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashbroad-flash.html',
  styleUrl: './dashbroad-flash.scss',
})
export class DashbroadFlash implements AfterViewInit {

  @Output() closed = new EventEmitter<void>();   

   closePopup() {
    this.closed.emit();
  }

  @ViewChild('lineChart', { static: false }) chartRef!: ElementRef;

  ngAfterViewInit() {
    this.renderLineChart();
    this.renderSalaryDonut();
  }

  renderLineChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.35)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.05)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T8', 'T9', 'T10', 'T11', 'T12', 'T1'],
        datasets: [
          {
            label: '2020',
            data: [110, 130, 150, 165, 180, 195],
            borderColor: '#7c3aed',
            backgroundColor: gradient,
            tension: 0.4,
            pointBackgroundColor: '#7c3aed',
            pointBorderColor: '#fff',
            pointRadius: 4,
            fill: true
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: { color: '#64748b' }
          }
        },
        scales: {
          x: {
            ticks: { color: '#475569' },
            grid: { color: '#e2e8f0' }
          },
          y: {
            ticks: { color: '#475569' },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  renderSalaryDonut() {
  const ctx = document.getElementById('salaryDonut') as HTMLCanvasElement;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Phòng IT', 'Phòng Marketing', 'Phòng kế toán', 'Phòng Nhân sự', 'Khác'],
      datasets: [
        {
          data: [42, 46, 48, 44, 50],
          backgroundColor: [
            '#60a5fa',
            '#fb7185',
            '#34d399',
            '#fbbf24',
            '#a78bfa'
          ],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
          cutout: '68%',
        } as any  // ⭐⭐ ÉP KIỂU Ở ĐÂY — 100% HẾT LỖI
      ]

    },
    plugins: [ChartDataLabels],
    options: {
      layout: { padding: 10 },

      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 13 },
            padding: 14
          }
        },

        datalabels: {
          color: '#475569',
          anchor: 'end',
          align: 'end',
          offset: 6,
          font: {
            weight: 600,
            size: 12
          },
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels![ctx.dataIndex];
            return label + '\n' + value;
          }
        }
      }
    }
  });

  // ⭐ LÀM TEXT GIỮA DONUT
  setTimeout(() => {
    const centerText = ctx.getContext('2d')!;
    centerText.font = '700 32px Inter';
    centerText.fillStyle = '#111827';
    centerText.textAlign = 'center';
    centerText.fillText('230', ctx.width / 2, ctx.height / 2 + 8);
  }, 200);
}

}
