import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LeaveStats {
  tongNghiPhepNam: number;
  tongNghiBenh: number;
  tongNghiKhongLuong: number;
}

@Component({
  selector: 'app-leave-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Leave-StatsPanel.component.html',
  styleUrl: './Leave-StatsPanel.component.scss'
})
export class LeaveStatsPanelComponent {
  @Input() stats!: LeaveStats;
}
