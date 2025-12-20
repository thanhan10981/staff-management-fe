// src/app/service/attendance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimpleItem, TyLeDiTrePhongBanChart, AttendanceDetail, TongNgayCongTheoThangItem, TongNgayCongResponse, TongLanDiTreResponse, TongNghiKhongPhepResponse, TiLeDungGioResponse } from '../model/simple-item.model';
import { EnumItem } from '../model/enum.model';
import { map } from 'rxjs/operators';
// attendance.service.ts
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private readonly baseUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  /* ===== ENUM THỜI GIAN ===== */
  /* ===== PHÒNG BAN ===== */
/* ===== PHÒNG BAN ===== */
getDepartments(): Observable<SimpleItem[]> {
  return this.http.get<any[]>(`${this.baseUrl}/phongban`).pipe(
    map(res =>
      res.map(item => ({
        id: item.id,
        name: item.tenPhongBan
      }))
    )
  );
}

/* ===== VỊ TRÍ CÔNG VIỆC ===== */
getPositions(): Observable<SimpleItem[]> {
  return this.http.get<any[]>(`${this.baseUrl}/vi-tri-cong-viec`).pipe(
    map(res =>
      res.map(item => ({
        id: item.id,
        name: item.tenViTri
      }))
    )
  );
}

getTongNgayCong(filter: {
    specificDate: string | null;
    timeRange: string | null;
    departmentId: number | null;
    positionId: number | null;
    }): Observable<TongNgayCongResponse> {

    let params = new HttpParams();

    if (filter.specificDate) {
        params = params.set('ngayChon', filter.specificDate);
    }
    if (filter.timeRange) {
        params = params.set('loai', filter.timeRange);
    }
    if (filter.departmentId) {
        params = params.set('maPhongBan', filter.departmentId);
    }
    if (filter.positionId) {
        params = params.set('maViTri', filter.positionId);
    }

    return this.http.get<TongNgayCongResponse>(
        `${this.baseUrl}/cham-cong/tong-ngay-cong`,
        { params }
    );
    }

    getTongLanDiTre(filter: {
    specificDate: string | null;
    timeRange: string | null;
    departmentId: number | null;
    positionId: number | null;
    }): Observable<TongLanDiTreResponse> {

    let params = new HttpParams();

    if (filter.specificDate) {
        params = params.set('ngayChon', filter.specificDate);
    }
    if (filter.timeRange) {
        params = params.set('loai', filter.timeRange);
    }
    if (filter.departmentId) {
        params = params.set('maPhongBan', filter.departmentId);
    }
    if (filter.positionId) {
        params = params.set('maViTri', filter.positionId);
    }

    return this.http.get<TongLanDiTreResponse>(
        `${this.baseUrl}/cham-cong/thong-ke/tong-lan-di-tre`,
        { params }
    );
    }

    getTongNghiKhongPhep(filter: {
    specificDate: string | null;
    timeRange: string | null;
    departmentId: number | null;
    positionId: number | null;
    }): Observable<TongNghiKhongPhepResponse> {

    let params = new HttpParams();

    if (filter.specificDate) {
        params = params.set('ngayChon', filter.specificDate);
    }
    if (filter.timeRange) {
        params = params.set('loai', filter.timeRange);
    }
    if (filter.departmentId) {
        params = params.set('maPhongBan', filter.departmentId);
    }
    if (filter.positionId) {
        params = params.set('maViTri', filter.positionId);
    }

    return this.http.get<TongNghiKhongPhepResponse>(
        `${this.baseUrl}/cham-cong/thong-ke/tong-nghi-khong-phep`,
        { params }
    );
    }

    getTiLeDungGio(filter: {
    specificDate: string | null;
    timeRange: string | null;
    departmentId: number | null;
    positionId: number | null;
    }): Observable<TiLeDungGioResponse> {

    let params = new HttpParams();

    if (filter.specificDate) {
        params = params.set('ngayChon', filter.specificDate);
    }
    if (filter.timeRange) {
        params = params.set('loai', filter.timeRange);
    }
    if (filter.departmentId) {
        params = params.set('maPhongBan', filter.departmentId);
    }
    if (filter.positionId) {
        params = params.set('maViTri', filter.positionId);
    }

    return this.http.get<TiLeDungGioResponse>(
        `${this.baseUrl}/cham-cong/thong-ke/ti-le-dung-gio`,
        { params }
    );
    }

    getTongNgayCongTheoThang(filter: {
    specificDate: string | null;
    departmentId: number | null;
    positionId: number | null;
    }) {
    const params: any = {};

    if (filter.specificDate) {
        params.ngayChon = filter.specificDate;
    }

    if (filter.departmentId) {
        params.maPhongBan = filter.departmentId;
    }

    if (filter.positionId) {
        params.maViTri = filter.positionId;
    }

    return this.http.get<TongNgayCongTheoThangItem[]>(
        `${this.baseUrl}/cham-cong/bieu-do/tong-ngay-cong-theo-thang`,
        { params }
    );
    }


    getTyLeDiTre(filter: any) {
    return this.http.get<TyLeDiTrePhongBanChart[]>(
        'http://localhost:9090/api/cham-cong/thong-ke/chart-phong-ban',
        {
        params: {
            ngayChon: filter.specificDate!,
            loai: filter.timeRange!
        }
        }
    );
    }

    getAttendanceByDate(
date: string,
maPhongBan?: number,
maViTri?: number
): Observable<AttendanceDetail[]> {
let params = new HttpParams()
.set('tuNgay', date)
.set('denNgay', date);


if (maPhongBan) params = params.set('maPhongBan', maPhongBan);
if (maViTri) params = params.set('maViTri', maViTri);


return this.http.get<AttendanceDetail[]>(`${this.baseUrl}/cham-cong/chi-tiet/ngay`, { params });
}


}
