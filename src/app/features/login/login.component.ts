import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../../service/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon],
  templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {

    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token, res.roles);
        this.profileService.loadSummary();
        if (res.roles.includes('QuanLyHeThong')) {
          this.router.navigate(['/admin']);
        } 
        else if (res.roles.includes('TaoLich')) {
          this.router.navigate(['/schedule']);
        } 
        else {
          this.router.navigate(['/dashboard']);
        }
      }

    });

    console.log("Sending login request:", this.form.value);

  }
  hidePassword = true;

togglePassword() {
  this.hidePassword = !this.hidePassword;
}

}