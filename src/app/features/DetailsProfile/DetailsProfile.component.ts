import { Component, OnInit  } from '@angular/core';
import { HeadComponent } from './Head/Head.component';
import { ProfileInfoComponent } from './ProfileInfo/ProfileInfo.component';
import { JobContactInfoComponent } from './JobContactInfo/JobContactInfo.component';
import { LogNearlyComponent } from './LogNearly/LogNearly.component';
import { SettingComponent } from './Setting/Setting.component';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KhoaDTO, ScheduleService } from '../../service/schedule.service';
import { PhongBanDTO } from '../../service/profile.service';
import { ViTriCongViecDTO, CapNhatThongTinNhanVien } from '../../model/profile.model';
import { ProfileService } from '../../service/profile.service';
@Component({
  selector: 'app-details-profile',
  standalone: true,
  templateUrl: './DetailsProfile.component.html',
  styleUrls: ['./DetailsProfile.component.scss'],
  imports: [FormsModule, CommonModule, HeadComponent, ProfileInfoComponent, JobContactInfoComponent, LogNearlyComponent, SettingComponent]
})
export class DetailsProfileComponent {

    isChangePasswordOpen = false;
    isEditProfileOpen = false;
    // DetailsProfile.component.ts
    @Output() closePopup = new EventEmitter<void>(); // đổi từ "closed" thành "closePopup"

    
  khoaList: KhoaDTO[] = [];
  selectedMaKhoa: number | null = null;
  phongBanList: PhongBanDTO[] = [];
  selectedPhongBanId: number | null = null;

  viTriList: ViTriCongViecDTO[] = [];
  selectedViTriId: number | null = null;
    formData: CapNhatThongTinNhanVien = {
    hoTen: '',
    email: '',
    sdt: '',
    ngaySinh: '',
    gioiTinh: null
  };
  maNhanVien!: number;


  constructor(
  private scheduleService: ScheduleService,
  private profileService: ProfileService
) {}


  ngOnInit(): void {
    this.loadKhoa();
    this.loadThongTinCaNhan();
  }
loadThongTinCaNhan() {
  this.profileService.getThongTinCaNhanForm().subscribe({
    next: data => {
      this.formData = {
        hoTen: data.hoTen,
        email: data.email,
        sdt: data.sdt,
        ngaySinh: data.ngaySinh,
        gioiTinh: data.gioiTinh
      };

      this.maNhanVien = data.maNhanVien; // readonly
    },
    error: err => {
      console.error('Không load được form', err);
    }
  });
}


  openEditProfile() {
    this.isEditProfileOpen = true;
    this.loadThongTinCaNhan();
  }

  saveProfile() {
    this.profileService.capNhatThongTinCaNhan(this.formData).subscribe({
      next: () => {
        alert('Cập nhật thông tin thành công');
        this.isEditProfileOpen = false;
      },
      error: err => {
        alert(err.error?.message || 'Cập nhật thất bại');
      }
    });
  }
  loadKhoa() {
    this.scheduleService.getKhoaList().subscribe({
      next: (data) => {
        this.khoaList = data;
      },
      error: () => {
        console.error('Không load được danh sách khoa');
      }
    });
  }

onKhoaChange(khoaId: number | null) {
  this.selectedPhongBanId = null;
  this.selectedViTriId = null;

  this.phongBanList = [];
  this.viTriList = [];

  if (!khoaId) return;

  this.scheduleService.getPhongBanTheoKhoa(khoaId).subscribe({
    next: data => this.phongBanList = data,
    error: () => console.error('Không load được phòng ban')
  });
}


onPhongBanChange(phongBanId: number | null) {
  console.log('PB:', phongBanId);

  this.selectedViTriId = null;
  this.viTriList = [];

  if (!phongBanId) return;

  this.profileService.getViTriTheoPhongBan(phongBanId).subscribe({
    next: data => this.viTriList = data,
    error: () => console.error('Không load được vị trí công việc')
  });
}




    close() {
    this.closePopup.emit();
    }

  closeEditProfile() {
    this.isEditProfileOpen = false;
  }

}