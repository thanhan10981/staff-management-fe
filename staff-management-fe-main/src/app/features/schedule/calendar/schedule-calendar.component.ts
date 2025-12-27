import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


import { AddScheduleComponent } from '../dialogs/add-schedule/add-schedule.component';
import { AssignShiftComponent } from '../dialogs/assign-shift/assign-shift.component';
import { Router } from '@angular/router';

import { Header } from '../../../core/layout/header/header';
import { Footer } from '../../../core/layout/footer/footer';
import { Sidebar } from '../../../core/layout/sidebar/sidebar';
import { ScheduleService } from '../../../service/schedule.service';

@Component({
  selector: 'app-schedule-calendar',
  standalone: true,
  imports: [
    CommonModule,
    Header, Footer, Sidebar,
    FullCalendarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit {

  @ViewChild('calendarRef') calendarRef: any;

  currentDate: Date = new Date();
  days: any[] = [];

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dayCellDidMount: (arg: any) => this.renderDayCell(arg),
    dateClick: (info: any) => this.dateClick(info),
    eventClick: (info: any) => this.eventClick(info),
    events: []
  };

  today = new Date().toISOString().split('T')[0];

  constructor(
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
  }

  // =============================
  // LOAD LỊCH
  // =============================
  loadMonth(year: number, month: number): void {
    this.currentDate = new Date(year, month - 1, 1);

    this.scheduleService.getSchedules(year, month).subscribe({
      next: (res: any[]) => {

        this.days = res;

        const events = res.flatMap(day =>
          (day.shifts ?? []).map((e: any) => ({
            title: `${e.tenNhanVien} - ${e.tenCa}`,
            date: day.date,
            display: 'block',
            classNames: [this.getShiftCssClass(e.maCa)],
            extendedProps: e
          }))
        );

        // --- FULLCALENDAR UPDATE ---
        const api = this.calendarRef?.getApi?.();
        if (api) {
          api.removeAllEvents();
          api.addEventSource(events);
        }
      },
      error: err => console.error(err)
    });
  }


  getShiftCssClass(maCa: number): string {
    switch (maCa) {
      case 1: return 'ca-sang';
      case 2: return 'ca-chieu';
      case 3: return 'ca-toi';
      case 4: return 'ca-dem';
      default: return '';
    }
  }

  // =============================
  // RENDER Ô LỊCH
  // =============================
  renderDayCell(arg: any) {
  const dateStr = arg.date.toISOString().split('T')[0];
  const day = this.days.find(d => d.date === dateStr);
  if (!day) return;

  // Xóa cell cũ
  arg.el.querySelectorAll(".cell-ca").forEach((e: any) => e.remove());

  type ShiftKey = 1 | 2 | 3 | 4;

  const counts: Record<ShiftKey, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
  };

  (day.shifts ?? []).forEach((e: any) => {
    const key = e.maCa as ShiftKey;   // ⭐ FIX LỖI TS
    counts[key]++;
  });

  const html = `
    ${counts[1] ? `<div class="cell-ca ca-sang">Sáng: ${counts[1]} nhân viên</div>` : ''}
    ${counts[2] ? `<div class="cell-ca ca-chieu">Chiều: ${counts[2]} nhân viên</div>` : ''}
    ${counts[3] ? `<div class="cell-ca ca-toi">Tối: ${counts[3]} nhân viên</div>` : ''}
    ${counts[4] ? `<div class="cell-ca ca-dem">Đêm: ${counts[4]} nhân viên</div>` : ''}
  `;

  const frame = arg.el.querySelector(".fc-daygrid-day-frame");
  if (frame) frame.insertAdjacentHTML("beforeend", html);
}


  // =============================
  // CLICK NGÀY
  // =============================
  dateClick(info: any) {
    const dialogRef = this.dialog.open(AddScheduleComponent, {
      width: '720px',
      data: { date: info.dateStr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        const d = new Date(info.dateStr);
        this.loadMonth(d.getFullYear(), d.getMonth() + 1);
      }
    });
  }

  // =============================
  // CLICK EVENT
  // =============================
  eventClick(info: any) {
    this.router.navigate(['/schedule/day', info.event.startStr]);
  }

  // =============================
  // PHÂN CA
  // =============================
  openAssignDialog() {
    const dialogRef = this.dialog.open(AssignShiftComponent, {
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
      }
    });
  }
}
