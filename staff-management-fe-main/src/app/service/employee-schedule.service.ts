import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhanCongCaTruc } from '../model/model';
import { LichTrucNgay } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeScheduleService {

  private api = 'http://localhost:9090/api/phancong';

  constructor(private http: HttpClient) {}
    
  /** Lấy danh sách phân công theo nhân viên */
  getByNhanVien(maNV: number): Observable<PhanCongCaTruc[]> {
    return this.http.get<PhanCongCaTruc[]>(`${this.api}/nhanvien/${maNV}`);
  }

  /** Lấy lịch trực theo tuần */
  getLichTuan(maNV: number, start: string, end: string): Observable<LichTrucNgay[]> {
    return this.http.get<LichTrucNgay[]>(
      `${this.api}/lich-tuan?maNV=${maNV}&start=${start}&end=${end}`
    );
  }
}
