import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonTabs } from '../common-tabs/common-tabs';
import { EmployeeScheduleService } from '../../../../service/employee-schedule.service';
import { LichTrucNgay } from '../../../../model/model';


@Component({
  selector: 'app-employee-schedule-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-schedule-popup.html',
  styleUrls: ['./employee-schedule-popup.scss']
})
export class EmployeeSchedulePopup implements OnInit {

  @Input() employeeId!: number;
  @Output() close = new EventEmitter<void>();        // ⬅ NÚT X
  @Output() closeAll = new EventEmitter<string>();   // ⬅ Báo cho cha mở popup khác

  activeTab = 'schedule';
  weekSchedule: any[] = [];

  summary = {
    totalShifts: 0,
    totalHours: 0,
    overtime: 0
  };

  constructor(private scheduleService: EmployeeScheduleService) {}

  ngOnInit() {
    this.loadWeek();
  }

  /** Lấy thứ 2 đầu tuần */
  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /** Cộng ngày */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  loadWeek() {
    const today = new Date();
    const monday = this.getMonday(today);
    const sunday = this.addDays(monday, 6);

    const start = monday.toISOString().split('T')[0];
    const end = sunday.toISOString().split('T')[0];

    this.scheduleService
      .getLichTuan(this.employeeId, start, end)
      .subscribe(res => {
        this.buildWeekUI(res, monday);
        this.buildSummary(res);
      });
  }

  /** Tổng hợp */
  buildSummary(list: LichTrucNgay[]) {
    this.summary.totalShifts = list.length;
    this.summary.totalHours = list.length * 8;
    this.summary.overtime = Math.max(0, this.summary.totalHours - 160);
  }

  /** Convert BE → UI */
  buildWeekUI(list: LichTrucNgay[], monday: Date) {
    this.weekSchedule = [];

    for (let i = 0; i < 7; i++) {
      const d = this.addDays(monday, i);
      const dateStr = d.toISOString().split('T')[0];

      const shifts = list
        .filter(x => x.ngayTruc === dateStr)
        .map(x => this.getCaName(x.maCa));

      this.weekSchedule.push({
        day: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i],
        shifts: shifts.length ? shifts : ['Nghỉ'],
        isOff: shifts.length === 0
      });
    }
  }

  getCaName(maCa: number) {
    return maCa === 1 ? 'Ca sáng'
         : maCa === 2 ? 'Ca chiều'
         : 'Ca tối';
  }

  // Tabs
  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  /** Đổi tab → báo popup cha */
  onTabChange(tabId: string) {
    this.activeTab = tabId;
    this.closeAll.emit(tabId);
  }

  /** NÚT X — đóng popup cha */
  closePopup() {
    this.close.emit();
  }

  /** Backup: nếu HTML gọi closeAll() */
  handleCloseAll() {
    this.closeAll.emit('employee');
  }
}
