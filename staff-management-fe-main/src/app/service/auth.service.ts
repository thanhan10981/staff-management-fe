import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:9090/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // ==================================================
  // CHECK BROWSER (fix lỗi: localStorage is not defined)
  // ==================================================
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // ==================================================
  // LOGIN
  // ==================================================
  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.API_URL}/login`, credentials);
  }

  // ==================================================
  // SAVE TOKEN & ROLES
  // ==================================================
  saveToken(token: string, roles: string[]) {
    if (!this.isBrowser()) return;
    localStorage.setItem('token', token);
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  // ==================================================
  // AUTH CHECK
  // ==================================================
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');  // 🔥 sửa lại, đúng key
    }
    this.router.navigate(['/login']);
  }

  // ==================================================
  // DECODE JWT
  // ==================================================
  private decodeToken(): any | null {
    if (!this.isBrowser()) return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // ==================================================
  // GET USER ID
  // ==================================================
  currentUserId(): number | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;

    return decoded.id ?? decoded.userId ?? null;
  }

  // ==================================================
  // GET ROLES (from storage)
  // ==================================================
  getRoles(): string[] {
    if (!this.isBrowser()) return [];
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  // ==================================================
  // GET ROLE (SINGLE) - OPTIONAL
  // ==================================================
  currentRole(): string {
    const roles = this.getRoles();
    return roles.length > 0 ? roles[0] : '';
  }
}
