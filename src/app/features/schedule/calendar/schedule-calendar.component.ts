import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { format } from 'date-fns';
import { Router } from '@angular/router';

import { AddScheduleComponent } from '../dialogs/add-schedule/add-schedule.component';
import { AssignShiftComponent } from '../dialogs/assign-shift/assign-shift.component';
import { Header } from '../../../core/layout/header/header';
import { Footer } from '../../../core/layout/footer/footer';
import { Sidebar } from '../../../core/layout/sidebar/sidebar';
import { DetailScheduleComponent } from '../detail-schedule/detail-schedule.component';

import { ScheduleService, KhoaDTO } from '../../../service/schedule.service';
import { StatsPanelComponent } from '../stats-panel/stats-panel.component';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-schedule-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    Header, Footer, Sidebar,
    StatsPanelComponent, FilterPanelComponent,
      MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleCalendarComponent implements OnInit {

  @ViewChild('calendarRef') calendarRef!: FullCalendarComponent;

  currentDate = new Date();
  days: { date: string, shifts: { maCa: number, count: number }[] }[] = [];
  khoas: KhoaDTO[] = [];
  selectedKhoaId = 0;

  fromDate!: Date;
  toDate!: Date;
  today = new Date().toISOString().split('T')[0];

  // FULLCALENDAR OPTIONS
  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: false,
    // FullCalendar v6: dayCellContent returns { html }
    dayCellContent: (arg: any) => this.renderDayCell(arg),
    dateClick: (info: any) => this.dateClick(info),
    eventClick: (info: any) => this.eventClick(info),
    firstDay: 1,
      timeZone: 'Asia/Ho_Chi_Minh',
    locale: 'vi',
    events: [] // start empty
  };

  constructor(
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // load list of khoa -> default selected = first one (if any)
    this.scheduleService.getKhoaList().subscribe({
      next: (list) => {
        this.khoas = list ?? [];
        // default to khoa 1 if you want explicitly, otherwise first in list
        this.selectedKhoaId = this.khoas[0]?.id ?? 1;
        console.log('Init khoas:', this.khoas);
        this.loadMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
      },
      error: () => {
        this.selectedKhoaId = 1;
        this.loadMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
      }
    });
  }

  // =============================
  // LOAD MONTH DATA
  // =============================
  loadMonth(year: number, month: number): void {
    this.currentDate = new Date(year, month - 1, 1);

    const from = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
    const to   = format(new Date(year, month, 0), 'yyyy-MM-dd');

    this.fromDate = new Date(from);
    this.toDate   = new Date(to);

    const maKhoa = this.selectedKhoaId ?? 0;
    console.log("📅 Load tháng với maKhoa =", maKhoa, 'from', from, 'to', to);

    this.scheduleService.getShiftsByKhoa(maKhoa, from, to).subscribe({
      next: (rows) => {
        console.log("Shifts RAW BE:", rows);

        // build day counts for rendering in cells
        this.days = this.groupByDate(rows);
        console.log("Group days:", this.days);

        // update events shown in calendar
        this.updateCalendarEvents(rows);

        // make sure calendar re-renders cells with updated days[]
        // call render on next tick so FullCalendar picks up dayCellContent
        setTimeout(() => {
          const api = this.calendarRef?.getApi?.();
          api?.render();
        }, 0);
      },
      error: err => {
        console.error("Load error:", err);
        this.days = [];
        this.updateCalendarEvents([]);
      }
    });
  }

  private updateCalendarEvents(raw: any[]) {
    const api = this.calendarRef?.getApi();
    if (!api) {
      // initial render path: set events in options so FC will pick them up
      this.calendarOptions = {
        ...this.calendarOptions,
        events: raw.map(e => ({
          id: e.maLichTruc,
          title: `${e.hoTen ?? ""} - Ca ${e.maCa}`,
          start: e.ngayTruc,
          allDay: true,
          classNames: [this.getShiftCssClass(e.maCa)],
          extendedProps: e
        }))
      };
      return;
    }

    // remove previous events and add new ones
    api.removeAllEvents();
    raw.forEach(e => {
      api.addEvent({
        id: e.maLichTruc,
        title: `${e.hoTen ?? ""} - Ca ${e.maCa}`,
        start: e.ngayTruc,
        allDay: true,
        classNames: [this.getShiftCssClass(e.maCa)],
        extendedProps: e
      });
    });

    // re-render to trigger dayCellContent again
    api.render();
  }

  // GROUP SHIFT BY DATE + COUNT PER SHIFT
  groupByDate(shifts: any[]) {
    const map: Record<string, any> = {};

    shifts.forEach((s: any) => {
      const date = s.ngayTruc;
      if (!map[date]) {
        map[date] = { date, shifts: [] as { maCa: number, count: number }[] };
      }

      let ca = map[date].shifts.find((x: any) => x.maCa === s.maCa);
      if (!ca) {
        ca = { maCa: s.maCa, count: 0 };
        map[date].shifts.push(ca);
      }
      ca.count++;
    });

    // keep stable sorted order by date (optional)
    return Object.values(map).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }

  // =============================
  // RENDER CUSTOM CELL (FullCalendar v6)
  // dayCellContent should return { html }
  // =============================
  renderDayCell(arg: any) {
    // arg.date is a Date
    const dateStr = arg.date.toISOString().split("T")[0];
    const day = this.days.find(d => d.date === dateStr);

    // always include day number text so default number still shows
    let html = `<div class="fc-daygrid-day-number">${arg.dayNumberText}</div>`;

    if (day && Array.isArray(day.shifts) && day.shifts.length > 0) {
      for (const shift of day.shifts) {
        const css = this.getShiftCssClass(shift.maCa);
        const label =
          shift.maCa === 1 ? "Sáng" :
          shift.maCa === 2 ? "Chiều" :
          shift.maCa === 3 ? "Tối"   : "Đêm";

        html += `
          <div class="cell-ca ${css}">
            ${label}: ${shift.count} nhân viên
          </div>
        `;
      }
    }

    return { html };
  }

  // =============================
  // EVENTS
  // =============================
dateClick(info: any) {
  const dlg = this.dialog.open(DetailScheduleComponent, {
    width: '1100px',
    maxWidth: '95vw',
    disableClose: true,
    data: {
      date: info.dateStr,
      maKhoa: this.selectedKhoaId
    }
  });

  dlg.afterClosed().subscribe(result => {
    if (result === 'refresh') {
      const d = new Date(info.dateStr);
      this.loadMonth(d.getFullYear(), d.getMonth() + 1);
    }
  });
}

eventClick(info: any) {
  this.dialog.open(DetailScheduleComponent, {
    width: '1100px',
    maxWidth: '95vw',
    data: {
      date: info.event.startStr,
      maKhoa: this.selectedKhoaId
    }
  });
}


  openAssignDialog() {
    const dlg = this.dialog.open(AssignShiftComponent, {
      width: '900px',
      data: { maKhoa: this.selectedKhoaId }
    });

    dlg.afterClosed().subscribe(r => {
      if (r === 'refresh') {
        this.loadMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
      }
    });
  }

  // =============================
  // NAVIGATION
  // =============================
  prevMonth() {
    const api = this.calendarRef?.getApi?.();
    if (!api) return;

    api.prev();
    const d = api.getDate();
    this.loadMonth(d.getFullYear(), d.getMonth() + 1);
  }

  nextMonth() {
    const api = this.calendarRef?.getApi?.();
    if (!api) return;

    api.next();
    const d = api.getDate();
    this.loadMonth(d.getFullYear(), d.getMonth() + 1);
  }

  goToday() {
    const t = new Date();
    this.loadMonth(t.getFullYear(), t.getMonth() + 1);
  }

  // Called when FilterPanel emits filterApply
  onFilterApply(payload: any) {
    console.log("🔥 Filter payload:", payload);

    if (payload && payload.khoaId !== undefined && payload.khoaId !== null) {
      // update selectedKhoaId immediately
      this.selectedKhoaId = payload.khoaId;
    }

    console.log("👉 selectedKhoaId =", this.selectedKhoaId);

    // reload calendar for current month with new khoa
    this.loadMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
  }

  getShiftCssClass(maCa: number) {
    return maCa === 1 ? 'ca-sang'
         : maCa === 2 ? 'ca-chieu'
         : maCa === 3 ? 'ca-toi'
         : 'ca-dem';
  }

  openAddDialog() {
    const dlg = this.dialog.open(AddScheduleComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        // mặc định là ngày hiện tại của calendar
        date: format(this.currentDate, 'yyyy-MM-dd'),
        maKhoa: this.selectedKhoaId
      }
    });

    dlg.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        // reload lại tháng hiện tại sau khi thêm lịch
        this.loadMonth(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + 1
        );
      }
    });
  }
  exportPdf() {
  if (!this.selectedKhoaId) {
    alert('Vui lòng chọn khoa');
    return;
  }

  const year = this.currentDate.getFullYear();
  const month = this.currentDate.getMonth() + 1;

  const url =
    `http://localhost:9090/api/schedules/export-pdf`
    + `?maKhoa=${this.selectedKhoaId}`
    + `&year=${year}`
    + `&month=${month}`;

  // ⭐ ĐỂ BROWSER TỰ DOWNLOAD
  window.location.href = url;
}


  printPdf() {
    if (!this.selectedKhoaId) {
      alert('Vui lòng chọn khoa');
      return;
    }

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;

    const url =
      `http://localhost:9090/api/schedules/print-pdf`
      + `?maKhoa=${this.selectedKhoaId}`
      + `&year=${year}`
      + `&month=${month}`;

    // 👉 mở tab mới để xem + Ctrl+P
    window.open(url, '_blank');
}

}
