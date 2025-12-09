import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashbroad-flash',
  standalone: true,
  imports: [],
  templateUrl: './dashbroad-flash.html',
  styleUrl: './dashbroad-flash.scss',
})
export class DashbroadFlash {
@Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}  
