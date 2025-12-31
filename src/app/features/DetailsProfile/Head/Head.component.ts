import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, ThongTinTongQuanNhanVien } from '../../../service/profile.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './Head.component.html',
  styleUrls: ['./Head.component.scss']
})
export class HeadComponent implements OnInit {

  summary$!: Observable<ThongTinTongQuanNhanVien>;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.summary$ = this.profileService.getThongTinTongQuan();
  }

}
