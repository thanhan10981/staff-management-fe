import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-depart-ment-employee-popup',
  standalone: true,
  templateUrl: './depart-ment-employee-popup.html',
  styleUrls: ['./depart-ment-employee-popup.scss'],
})
export class DepartMentEmployeePopupComponent {
 @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
