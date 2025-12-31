import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftSwapDetailModel } from '../../../../model/model';

@Component({
  selector: 'app-shift-swap-detail-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shift-swap-detail-popup.html',
  styleUrls: ['./shift-swap-detail-popup.scss']
})
export class ShiftSwapDetailPopup {

  @Input() data!: ShiftSwapDetailModel;
  @Output() close = new EventEmitter<void>();

}
