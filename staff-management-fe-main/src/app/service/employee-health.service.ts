import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHealthService {

  private apiUrl = 'http://localhost:9090/api/tiemchung';

  constructor(private http: HttpClient) {}

  // Lấy tất cả tiêm chủng 
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Lấy theo mã nhân viên
  getByNhanVien(maNhanVien: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nhanvien/${maNhanVien}`);
  }
}
