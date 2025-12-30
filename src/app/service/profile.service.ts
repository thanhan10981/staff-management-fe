import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { ThongTinCaNhan, AuditLog, DoiMatKhauDto } from '../model/profile.model';
import { ThongTinLienHeCongViec, ViTriCongViecDTO, CapNhatThongTinNhanVien, ThongTinNhanVienFormDto } from '../model/profile.model';

export interface NhanVienTomTat {
  tenNhanVien: string;
  email: string;
  anhDaiDien: string;
  tenViTri: string;
}


export interface ThongTinTongQuanNhanVien {
  hoTen: string;
  anhDaiDien: string;
  tenViTri: string;
  dangNhapCuoi: string; // ISO string
}
export interface PhongBanDTO {
  id: number;
  tenPhongBan: string;
  maKhoa: number;
  tenKhoa?: string;
}



@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private API_URL = 'http://localhost:9090/api/profile';
  private BASE = 'http://localhost:9090';

  private summarySubject = new BehaviorSubject<NhanVienTomTat | null>(null);
  summary$ = this.summarySubject.asObservable();
  
  private profileInfoSubject =
    new BehaviorSubject<ThongTinCaNhan | null>(null);

  profileInfo$ = this.profileInfoSubject.asObservable();
  constructor(private http: HttpClient) {}

  private jobContactSubject =
  new BehaviorSubject<ThongTinLienHeCongViec | null>(null);

    private recentLogsSubject =
    new BehaviorSubject<AuditLog[]>([]);

  recentLogs$ = this.recentLogsSubject.asObservable();

jobContact$ = this.jobContactSubject.asObservable();

  loadSummary() {
    return this.http.get<NhanVienTomTat>(`${this.API_URL}/summary`)
      .subscribe({
        next: data => this.summarySubject.next(data),
        error: () => this.summarySubject.next(null)
      });
  }


    getThongTinTongQuan(): Observable<ThongTinTongQuanNhanVien> {
    return this.http.get<ThongTinTongQuanNhanVien>(`${this.API_URL}/me/overview`);
  }

  loadThongTinCaNhan(): void {
    this.http.get<ThongTinCaNhan>(`${this.API_URL}/me`)
      .subscribe(res => this.profileInfoSubject.next(res));
  }

  loadThongTinLienHeCongViec(): void {
    this.http.get<ThongTinLienHeCongViec>(
      `${this.API_URL}/lien-he-cong-viec`
    ).subscribe({
      next: res => this.jobContactSubject.next(res),
      error: () => this.jobContactSubject.next(null)
    });
  }

  loadRecentLogs(): void {
  this.http.get<AuditLog[]>(`${this.API_URL}/recent`)
    .subscribe({
      next: res => this.recentLogsSubject.next(res),
      error: () => this.recentLogsSubject.next([])
    });
  }
    doiMatKhau(dto: DoiMatKhauDto): Observable<any> {
    return this.http.put(`${this.API_URL}/doi-mat-khau`, dto);
  }
  /* ===== Clear khi logout ===== */
  clear(): void {
    this.profileInfoSubject.next(null);
    this.summarySubject.next(null);
    this.jobContactSubject.next(null);
    this.recentLogsSubject.next([]);
  }
  
  getPhongBanTheoKhoa(maKhoa: number) {
    return this.http.get<PhongBanDTO[]>(
      `${this.BASE}/api/phongban/khoa/${maKhoa}`
    );
  }
  getViTriTheoPhongBan(maPhongBan: number) {
    return this.http.get<ViTriCongViecDTO[]>(
      `${this.BASE}/api/vi-tri-cong-viec/phongban/${maPhongBan}`
    );
  }


  capNhatThongTinCaNhan(payload: CapNhatThongTinNhanVien) {
    return this.http.put(
      `${this.API_URL}/thong-tin-ca-nhan`,
      payload
    );
  }

getThongTinCaNhanForm(): Observable<ThongTinNhanVienFormDto> {
  return this.http.get<ThongTinNhanVienFormDto>(
        `${this.API_URL}/me/form`
      );
    }



}
