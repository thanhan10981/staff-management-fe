// src/app/service/schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LichTrucTuanDTO } from '../model/model';
import { ViTriCongViecDTO } from '../model/profile.model';

export interface KhoaDTO {
  id: number;
  tenKhoa: string;
  moTa?: string;
}


export interface CaDTO {
  id: number;
  tenCa: string;
  batDau?: string;
  ketThuc?: string;
}

export interface DayEntryDTO {
  id: number;
  nhanVien: string;
  caId: number;
  caName: string;
}

export interface DayDetailScheduleDTO {
  maLichTruc: number;

  anhDaiDien?: string;
  hoTen: string;
  tenViTri: string;
  tenPhong: string;
  tenKhoa: string;
  tenCa: string;

  tongGioLam: number;
  trangThai: 'Chưa làm' | 'Đang làm' | 'Đã kết thúc ca' | string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private BASE = 'http://localhost:9090';
  private API_LICH = `${this.BASE}/api/lichtruc`;
  private API_SHIFTS = `${this.BASE}/api/shifts`;
  private API_CONFIG = `${this.BASE}/api/shifts/ca`;
  private API_KHOA = `${this.BASE}/api/khoa`;
  private baseUrl = '/api/schedules';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  exportMonthlyPdf(
    maKhoa: number,
    year: number,
    month: number
  ): Observable<Blob> {

    const params = new HttpParams()
      .set('maKhoa', maKhoa)
      .set('year', year)
      .set('month', month);

    return this.http.get(
      `${this.baseUrl}/export-pdf`,
      {
        params,
        responseType: 'blob'   // ⭐ QUAN TRỌNG
      }
    );
  }
  // === DANH SÁCH KHOA ===
  getKhoaList(): Observable<KhoaDTO[]> {
    return this.http.get<KhoaDTO[]>(this.API_KHOA);
  }

  // === LỊCH THEO KHOA (FULLCALENDAR) ===
  getShiftsByKhoa(maKhoa: number, from: string, to: string): Observable<any[]> {
    const params = new HttpParams()
      .set('maKhoa', String(maKhoa))
      .set('from', from)
      .set('to', to);

    return this.http.get<any[]>(this.API_SHIFTS, { params });
  }


  // === CA (config) ===
  getAllCa(): Observable<CaDTO[]> {
    return this.http.get<CaDTO[]>(this.API_CONFIG);
  }

  // === TẠO 1 LỊCH ===
  createSchedule(payload: any): Observable<any> {
    const actorId = this.auth.currentUserId() ?? 0;
    return this.http.post<any>(`${this.API_SHIFTS}/assign`, payload, {
      params: { actorId: String(actorId) }
    });
  }

  // === PHÂN CÔNG HÀNG LOẠT ===


  // === XÓA LỊCH ===
  deleteSchedule(id: number): Observable<any> {
    const actorId = this.auth.currentUserId() ?? 0;
    return this.http.delete<any>(`${this.API_SHIFTS}/${id}`, {
      params: { actorId: String(actorId) }
    });
  }

  // === LỊCH NHÂN VIÊN ===
  getUserSchedule(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_SHIFTS}/user/${employeeId}`);
  }

  // === THỐNG KÊ ===
  getMonthStats(maKhoa: number, from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.API_SHIFTS}/stats`, {
      params: { maKhoa: String(maKhoa), from, to }
    });
  }

  // === ⭐ NEW — LẤY DỮ LIỆU CHI TIẾT TRONG 1 NGÀY (Day Detail) ===
  getDay(date: string, maKhoa?: number): Observable<DayEntryDTO[]> {

    let params = new HttpParams().set('date', date);
    if (maKhoa) params = params.set('maKhoa', String(maKhoa));

    // giả định BE có endpoint: GET /api/shifts/day
    return this.http.get<DayEntryDTO[]>(`${this.API_SHIFTS}/day`, { params });
  }

  getDayCounts(maKhoa: number, date: string) {
    let params = new HttpParams().set('date', date);
    if (maKhoa !== undefined && maKhoa !== null) {
      params = params.set('maKhoa', String(maKhoa));
    }

    // returns Observable<Record<number, number>>
    return this.http.get<Record<number, number>>(`${this.API_LICH}/count`, { params });
  }
  
  getTotalShifts(
  maKhoa: number,
  from: string,
  to: string
): Observable<any[]> {
  return this.http.get<any[]>(`${this.API_LICH}/khoa`, {
    params: { maKhoa, from, to }
  });
}


  getEmployeesWithShifts(maKhoa: number, year: number, month: number) {
    return this.http.get(`${this.API_LICH}/nhanvien/thang`, {
      params: { maKhoa, year, month }
    });
  }

  getMonthlyShiftStats(maKhoa: number, year: number, month: number) {
    return this.http.get(`${this.API_LICH}/stats/thang`, {
      params: { maKhoa, year, month }
    });
  }

    getPhongBanTheoKhoa(maKhoa: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/api/phongban/khoa/${maKhoa}`);
  }

  // ==========================
  // 2) Phòng vật lý theo khoa
  // ==========================
  getPhongVLTheoKhoa(maKhoa: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/api/phong/khoa/${maKhoa}`);
  }

  // ==========================
  // 3) Danh sách nhân viên theo khoa + phòng
  // ==========================
  getNhanVienTheoKhoaPhong(maKhoa: number, maPhong?: number): Observable<any[]> {
    let params = new HttpParams()
      .set('maKhoa', String(maKhoa));

    if (maPhong) {
      params = params.set('maPhong', String(maPhong));
    }

    return this.http.get<any[]>(`${this.BASE}/api/shifts/nhanvien`, { params });
  }

  // ==========================
  // 4) Danh sách ca làm việc
  // ==========================

  // ==========================
  // 5) Tạo phân công
  // ==========================
createPhanCong(payload: any) {
  return this.http.post(
    `${this.BASE}/api/phancong/create-with-lich`,
    payload,
    { responseType: 'text' }
  );
}
// lịch trực tuần
getLichTuanTheoKhoa(
  maKhoa: number,
  from: string,
  to: string
): Observable<LichTrucTuanDTO[]> {
  return this.http.get<LichTrucTuanDTO[]>(
    `${this.API_LICH}/tuan/khoa/${maKhoa}`,
    { params: { from, to } }
  );
}

// ==========================
// ⭐ DAY DETAIL – POPUP
// ==========================
// ==========================
// ⭐ DAY DETAIL – POPUP
// ==========================
getDayDetail(
  ngayTruc: string,
  maKhoa: number
): Observable<DayDetailScheduleDTO[]> {

  const params = new HttpParams()
    .set('ngayTruc', ngayTruc)
    .set('maKhoa', String(maKhoa));

  return this.http.get<DayDetailScheduleDTO[]>(
    `${this.BASE}/api/schedules/chi-tiet`,
    { params }
  );
}
    getViTriTheoPhongBan(maPhongBan: number) {
      return this.http.get<ViTriCongViecDTO[]>(
        `${this.BASE}/api/vi-tri-cong-viec/phongban/${maPhongBan}`
      );
    }

}

