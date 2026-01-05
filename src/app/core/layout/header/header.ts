import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // ← thêm dòng này
import { ProfileService } from '../../../service/profile.service';
import { NhanVienTomTat } from '../../../service/profile.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { DetailsProfileComponent } from '../../../features/DetailsProfile/DetailsProfile.component';
import { ChangePasswordComponent } from '../../../features/DetailsProfile/Setting/change-password.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DetailsProfileComponent, ChangePasswordComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  dropdownOpen = false;
  showProfilePopup = false;
  showChangePassword = false;

  summary$!: Observable<NhanVienTomTat | null>;
    constructor(private profileService: ProfileService,
        private auth: AuthService
    ) {
    this.summary$ = this.profileService.summary$;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

    openProfile() {
    this.showProfilePopup = true;
    this.dropdownOpen = false;
  }

  closeProfile() {
    this.showProfilePopup = false;
  }
    openChangePassword() {
    this.showChangePassword = true;
    this.dropdownOpen = false;
  }
  logout(event: Event) {
  event.stopPropagation(); // ⭐ tránh toggle dropdown
  this.profileService.clear(); // xóa data header
  this.auth.logout();          // xóa token + navigate /login
}

}
