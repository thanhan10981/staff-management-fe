import { Component, ViewChild } from '@angular/core';
import { DepartMentEmployeePopupComponent } from './depart-ment-employee-popup/depart-ment-employee-popup';
import { CommonModule } from '@angular/common';
import { DashbroadFlash } from './dashbroad-flash/dashbroad-flash';
import { ScheduleEmployeeReportPopup } from './schedule-employee-report-popup/schedule-employee-report-popup';


@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [DepartMentEmployeePopupComponent, CommonModule, DashbroadFlash, ScheduleEmployeeReportPopup],
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
  
}
