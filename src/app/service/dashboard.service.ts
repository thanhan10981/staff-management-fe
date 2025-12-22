import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private API = 'http://localhost:9090/api/dashboard';

  constructor(private http: HttpClient) {}


getTiLeNghiPhep() {
  return this.http.get<{ tiLe: number; chenhLech: number }>(
    `${this.API}/ti-le-nghi-phep`
  );
}
  // Donut cũ (theo phòng ban) – nếu còn dùng
  getNhanVienTheoPhongBan() {
    return this.http.get<{ tenPhongBan: string; soLuong: number }[]>(
      `${this.API}/phong-ban`
    );
  }

  // Line chart – xu hướng nhân sự theo tháng
  getNhanVienTheoThang() {
    return this.http.get<{ thang: number; soLuong: number }[]>(
      `${this.API}/trend`
    );
  }

  /* ================= LƯƠNG ================= */

  // 🔥 DONUT: CƠ CẤU LƯƠNG (API backend bạn vừa làm)
  getCoCauLuong() {
    return this.http.get<{ ten: string; soTien: number }[]>(
      `${this.API}/luong`
    );
  }
  getThongKeNhanVien() {
  return this.http.get<{ tong: number; chenhLech: number }>(
    `${this.API}/nhan-vien`
  );
}

}
