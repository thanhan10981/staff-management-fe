import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../service/auth.service';
import { ScheduleService } from '../../../service/schedule.service';


@Component({
  selector: 'app-user-schedule',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule],
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.scss']
})
export class UserScheduleComponent implements OnInit {
  schedules: any[] = [];
  employeeId: number | null = null;

  constructor(
      private scheduleService: ScheduleService,
      private auth: AuthService
    ) {}

    ngOnInit(): void {
      this.employeeId = this.auth.currentUserId();  // Lấy userId từ token

      if (this.employeeId == null) {
        console.error("User ID not found in token!");
        return;
      }

      this.scheduleService.getUserSchedule(this.employeeId).subscribe({
        next: (res: any) => (this.schedules = res),
        error: (err: any) => console.error(err)
      });
    }

  load() {
    if (!this.employeeId) return;
    this.scheduleService.getUserSchedule(this.employeeId).subscribe({
      next: (res) => (this.schedules = res),
      error: (err) => console.error(err)
    });
  }
}
