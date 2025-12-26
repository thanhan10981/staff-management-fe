import { Component, ViewChild } from '@angular/core';
import { DepartMentEmployeePopupComponent } from './depart-ment-employee-popup/depart-ment-employee-popup';
import { CommonModule } from '@angular/common';
import { DashbroadFlash } from './dashbroad-flash/dashbroad-flash';
import { ScheduleEmployeeReportPopup } from './schedule-employee-report-popup/schedule-employee-report-popup';
import { AttendanceStatisticsComponent } from '../attendance-statistics/attendance-statistics.component';
import { LeaveReportComponent } from '../leave-report/leave-report.component';

@Component({
  selector: 'app-reporting',
  standalone: true,
    imports: [
    CommonModule,
    DepartMentEmployeePopupComponent,
    DashbroadFlash,
    ScheduleEmployeeReportPopup,
    AttendanceStatisticsComponent,
    LeaveReportComponent
  ],
  templateUrl: './reporting.html',
  styleUrls: ['./reporting.scss'],
})
export class ReportingComponent {

  showDepartmentPopup = false;

  openDepartmentPopup() {
    this.showDepartmentPopup = true;
  }

  closeDepartmentPopup() {
    this.showDepartmentPopup = false;
  }
  showDashbroadPopup = false;

  openDashbroadPopup() {
    this.showDashbroadPopup = true;
  }

  closeDashbroadPopup() {
    this.showDashbroadPopup = false;
  }

  // báo cáo lịch trực
 showSchedulePopup = false;

  openSchedulePopup() {
    this.showSchedulePopup = true;
  }

  closeSchedulePopup() {
    this.showSchedulePopup = false;
  }
  
  // báo cáo thống kê chấm công
  showAttendancePopup = false;

  openAttendancePopup() {
    this.showAttendancePopup = true;
  }

  closeAttendancePopup() {
    this.showAttendancePopup = false;
  }

  // báo cáo nghỉ phép
  showLeavePopup = false;

openLeavePopup() {
  this.showLeavePopup = true;
}

closeLeavePopup() {
  this.showLeavePopup = false;
}

}
