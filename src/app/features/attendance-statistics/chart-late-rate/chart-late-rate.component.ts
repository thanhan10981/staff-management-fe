import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Plugin } from 'chart.js';
import { TyLeDiTrePhongBanChart } from '../../../model/simple-item.model';
@Component({
  selector: 'app-chart-late-rate',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-late-rate.component.html',
  styleUrls: ['./chart-late-rate.component.scss']
})
export class ChartLateRateComponent {

  total = 0;
  hasData = true;
emptyMessage = 'Trong khoảng thời gian đã chọn, không có phòng ban nào đi trễ';


@Input() set data(value: TyLeDiTrePhongBanChart[]) {
  // ❌ không có data
  if (!value || value.length === 0) {
    this.hasData = false;
    this.resetChart();
    return;
  }

  // ❌ tất cả = 0
  const total = value.reduce((s, v) => s + v.tiLe, 0);
  if (total === 0) {
    this.hasData = false;
    this.resetChart();
    return;
  }

  // ✅ có dữ liệu hợp lệ
  this.hasData = true;
  this.total = 100;

  this.doughnutData.labels = value.map(v => v.tenPhongBan);
  this.doughnutData.datasets[0].data =
    value.map(v => v.tiLe);
}

private resetChart() {
  this.total = 0;
  this.doughnutData.labels = [];
  this.doughnutData.datasets[0].data = [];
}


  doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
        {
        data: []
        }
    ]
    };

    doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '70%',
    layout: {
      padding: {
        top: 50,
        bottom: 50,
        left: 40,
        right: 40   // ✅ CHỪA CHỖ LABEL + LINE
      }
    },
    plugins: {
      legend: {
        position: 'right'
      },
      datalabels: {
        display: false,
        color: '#374151',
        font: {
          size: 12,
          weight: 500
        },
        align: 'end',
        anchor: 'end',
        offset: 12,
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels?.[ctx.dataIndex];
          return `${label}\n${value}%`;
        }
      }
    }
  };




  /** plugin hiển thị số ở giữa */
  centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  afterDraw: chart => {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);

    if (!meta || !meta.data || meta.data.length === 0) return;

    // 🎯 LẤY TÂM DONUT THẬT
    const { x, y } = meta.data[0];

    ctx.save();
    ctx.font = '600 24px sans-serif';
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.total.toString(), x, y);
    ctx.restore();
  }
};
leaderLinePlugin: Plugin<'doughnut'> = {
  id: 'leaderLine',
  afterDraw: chart => {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    const data = chart.data.datasets[0].data as number[];
    const labels = chart.data.labels as string[];

    if (!meta?.data) return;

    meta.data.forEach((arc: any, index: number) => {
      const { x, y, startAngle, endAngle, outerRadius } = arc;
      const angle = (startAngle + endAngle) / 2;

      // 🔹 mép donut
      const startX = x + Math.cos(angle) * outerRadius;
      const startY = y + Math.sin(angle) * outerRadius;

      // 🔹 đoạn xéo
      const midX = x + Math.cos(angle) * (outerRadius + 26);
      const midY = y + Math.sin(angle) * (outerRadius + 26);

      const isRight = Math.cos(angle) >= 0;

      // 🔹 chiều dài line ngang
      const lineLength = 90;

      // 🔹 line ngang CHẠY QUA TÂM TEXT
      const lineStartX = midX;
      const lineEndX = midX + (isRight ? lineLength : -lineLength);

      // 🔹 TÂM của line ngang (điểm vẽ text)
      const labelX = midX + (isRight ? lineLength / 2 : -lineLength / 2);
      const labelY = midY;

      const color = arc.options.backgroundColor || '#9CA3AF';

      // 🧵 vẽ line
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(midX, midY);
      ctx.lineTo(lineEndX, midY);
      ctx.stroke();

      // 📝 text ĐÈ LÊN LINE
      ctx.fillStyle = color;
      ctx.textAlign = 'center'; // 🔥 BẮT BUỘC

      // 👉 TÊN PHÒNG – TRÊN LINE
      ctx.font = '500 12px sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.fillText(labels[index], labelX, labelY - 2);

      // 👉 % – DƯỚI LINE
      ctx.font = '600 12px sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(`${data[index]}%`, labelX, labelY + 2);

      ctx.restore();
    });
  }
};


}
