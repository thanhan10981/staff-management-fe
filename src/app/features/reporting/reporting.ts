import { Component, ViewChild } from '@angular/core';
import { DepartMentEmployeePopupComponent } from './depart-ment-employee-popup/depart-ment-employee-popup';
import { CommonModule } from '@angular/common';
import { DashbroadFlash } from './dashbroad-flash/dashbroad-flash';


@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [DepartMentEmployeePopupComponent, CommonModule, DashbroadFlash],
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
 
}
