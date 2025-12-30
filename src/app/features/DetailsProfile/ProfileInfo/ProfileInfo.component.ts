import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../service/profile.service';
import { ThongTinCaNhan } from '../../../model/profile.model';

@Component({
  selector: 'app-profileinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ProfileInfo.component.html',
  styleUrls: ['./ProfileInfo.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  info$!: Observable<ThongTinCaNhan | null>;

  constructor(private profileService: ProfileService) {
    this.info$ = this.profileService.profileInfo$;
  }

  ngOnInit(): void {
    this.profileService.loadThongTinCaNhan();
  }

  genderText(value: boolean | undefined): string {
    return value ? 'Nam' : 'Nữ';
  }
}
