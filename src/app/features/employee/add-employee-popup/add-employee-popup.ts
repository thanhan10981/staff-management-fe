import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-employee-popup',
  standalone: true,
  imports: [],
  templateUrl: './add-employee-popup.html',
  styleUrls: ['./add-employee-popup.scss'],
})
export class AddEmployeePopup {
   @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
