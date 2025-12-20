import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeaveDetail} from '../../../model/leave-report.model';

@Component({
  selector: 'app-leave-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Leave-Detail.component.html',
  styleUrls: ['./Leave-Detail.component.scss']
})
export class LeaveDetailComponent {
  @Input() data: LeaveDetail[] = [];

  getAvatarUrl(avatar: string): string {
    return avatar
      ? `http://localhost:9090/uploads/avatars/${avatar}`
      : 'assets/default-avatar.png';
  }
}
