import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ScheduleService } from '../../../service/schedule.service';

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule],
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss']
})
export class DayDetailComponent implements OnInit {
  date = '';
  entries: any[] = [];

  constructor(private route: ActivatedRoute, private scheduleService: ScheduleService) {}
  ngOnInit(): void {
    this.scheduleService.getDay(this.date).subscribe({
      next: (res: any) => this.entries = res,
      error: (err: any) => console.error(err)
    });
  }


  load() {
    if (!this.date) return;
    this.scheduleService.getDay(this.date).subscribe({
      next: (res) => (this.entries = res),
      error: (err) => console.error(err)
    });
  }
}
