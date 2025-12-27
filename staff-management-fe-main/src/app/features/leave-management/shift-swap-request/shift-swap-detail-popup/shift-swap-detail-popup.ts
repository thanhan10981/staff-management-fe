import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShiftSwapDetailModel} from '../../../../model/model';

@Component({
  selector: 'app-shift-swap-detail-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shift-swap-detail-popup.html',
  styleUrls: ['./shift-swap-detail-popup.scss']
})
export class ShiftSwapDetailPopup {

  @Input() data!: ShiftSwapDetailModel;


  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  rejectNote = '';

  onApprove() {
    this.approve.emit();
  }

  onReject() {
    if (!this.rejectNote.trim()) {
      return;
    }
    this.reject.emit(this.rejectNote);
  }
}
