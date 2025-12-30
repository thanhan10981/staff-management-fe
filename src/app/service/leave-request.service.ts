import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private apiUrl = 'http://localhost:9090/api/DonNghiPhep';

  constructor(private http: HttpClient) {}

  // Lấy tất cả đơn nghỉ phép
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Tạo đơn nghỉ phép mới
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Lấy đơn nghỉ phép theo ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Cập nhật đơn nghỉ phép
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Xóa đơn nghỉ phép
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Tìm kiếm đơn nghỉ phép
  search(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/${keyword}`);
  }

approve(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/approve`, {});
}

reject(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/reject`, {});
}



}
