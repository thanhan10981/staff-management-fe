import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  ShiftSwapCreateForm, ShiftSwapDetailModel, ShiftSwapRequestCreateModel, ShiftSwapRequestModel } from '../model/model';

@Injectable({ providedIn: 'root' })
export class ShiftSwapRequestService {

  private apiUrl = 'http://localhost:9090/api/YeuCauDoiCa';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCreateForm(nhanVienId: number) {
    return this.http.get<ShiftSwapCreateForm>(
      `${this.apiUrl}/create-form/${nhanVienId}`
    );
  }

  create(dto: ShiftSwapRequestCreateModel) {
    return this.http.post(this.apiUrl, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

   approve(maYeuCau: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${maYeuCau}/approve`, {});
  }

  reject(maYeuCau: number, note: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${maYeuCau}/reject`, {
      ghiChu: note
    });
  }
  getDetail(id: number): Observable<ShiftSwapDetailModel> {
  return this.http.get<ShiftSwapDetailModel>(
    `${this.apiUrl}/${id}`
  );
}

}
