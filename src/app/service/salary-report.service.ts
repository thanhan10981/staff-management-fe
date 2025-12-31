import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalaryReportService {

  private API = 'http://localhost:9090/api/dashboard';

  constructor(private http: HttpClient) {}

 getKpiLuong(period: string, department?: number, role?: string) {
    return this.http.get<any>(`${this.API}/luong/kpi`, {
      params: this.buildParams(period, department, role)
    });
  }

  /* ===== BAR CHART ===== */
  getQuyLuongTheoPhongBan(period: string, department?: number, role?: string) {
    return this.http.get<any[]>(`${this.API}/quy-luong-phong-ban`, {
      params: this.buildParams(period, department, role)
    });
  }

  /* ===== DONUT ===== */
  getCoCauLuong(period: string, department?: number) {
    return this.http.get<any[]>(`${this.API}/luong-bao-cao`, {
      params: this.buildParams(period, department)
    });
  }

  /* ===== TABLE ===== */
  getBangLuongNhanVien(period: string, department?: number, role?: string) {
    return this.http.get<any[]>(`${this.API}/luong/bang-nhan-vien`, {
      params: this.buildParams(period, department, role)
    });
  }

  /* ===== PARAM BUILDER (🔥 QUAN TRỌNG) ===== */
  private buildParams(period: string, department?: number, role?: string) {
    let params = new HttpParams().set('period', period);

    if (department !== undefined) {
      params = params.set('department', department);
    }

    if (role) {
      params = params.set('role', role);
    }

    return params;
  }
}