import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { TongNgayCongTheoThangItem } from '../../../model/simple-item.model';

@Component({
  selector: 'app-chart-workdays',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-workdays.component.html',
  styleUrls: ['./chart-workdays.component.scss']
})
export class ChartWorkdaysComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
@Input() set data(value: TongNgayCongTheoThangItem[]) {
  if (!value?.length) return;

  const dataByMonth = Array(12).fill(0);
  value.forEach(i => dataByMonth[i.thang - 1] = i.tongNgayCong);

  this.lineChartData = {
    ...this.lineChartData,
    datasets: [
      { ...this.lineChartData.datasets[0], data: dataByMonth }
    ]
  };
}




  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
    datasets: [
      {
        data: [],
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,

        borderColor: '#3b82f6',              // ⬅ BẮT BUỘC
        backgroundColor: 'rgba(59,130,246,.2)'
      }
    ]

  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
     scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10
      }
    }
  }
  };
}
