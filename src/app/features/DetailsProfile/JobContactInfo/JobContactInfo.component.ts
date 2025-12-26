import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../service/profile.service';
import { ThongTinLienHeCongViec } from '../../../model/profile.model';

@Component({
  selector: 'app-job-contact-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './JobContactInfo.component.html',
  styleUrls: ['./JobContactInfo.component.scss']
})
export class JobContactInfoComponent implements OnInit {

  jobContact$!: Observable<ThongTinLienHeCongViec | null>;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    // bind observable
    this.jobContact$ = this.profileService.jobContact$;

    // trigger load data
    this.profileService.loadThongTinLienHeCongViec();
  }
}
