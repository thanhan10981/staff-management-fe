import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChamCongToday } from '../model/cham-cong.model';
import { QRCheckinRequest } from '../model/qr-checkin.model';

// model
export interface ChamCongRealtime {
  thoiGian: string;
  trangThai: string;
  thietBi: string;
}


@Injectable({ providedIn: 'root' })
export class ChamCongService {

  private readonly API = 'http://localhost:9090/api/cham-cong';

  constructor(private http: HttpClient) {}

  /** Lấy chấm công hôm nay */
  getToday(): Observable<ChamCongToday> {
    return this.http.get<ChamCongToday>(`${this.API}/today`);
  }

  /** Chấm công bằng nút */
  checkinByButton(thietBi: string): Observable<string> {
    const params = new HttpParams().set('thietBi', thietBi);
    return this.http.post(`${this.API}/checkin`, null, {
      params,
      responseType: 'text'
    });
  }

  /** Chấm công bằng QR */
// cham-cong.service.ts
    checkinByQR(data: { maQRCode: string; thietBi: string }) {
    return this.http.post<ChamCongRealtime>(
        `${this.API}/qr`,
        data
    );
    }

    createQR() {
  return this.http.post<{ maQRCode: string; expireAt: string }>(
    `${this.API}/qr/create`,
    {}
  );
}


}
