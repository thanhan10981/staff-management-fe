import { Component } from '@angular/core';
import { DepartMentEmployeePopupComponent } from './depart-ment-employee-popup/depart-ment-employee-popup';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [DepartMentEmployeePopupComponent,CommonModule],
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
}
