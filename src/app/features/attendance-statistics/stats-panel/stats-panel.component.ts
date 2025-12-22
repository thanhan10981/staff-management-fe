import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.scss']
})
export class StatsPanelComponent {

  @Input() totalWorkDays = 0;
  @Input() lateCount = 0;
  @Input() absentWithoutLeave = 0;
  @Input() onTimeRate = 0; // %
}
