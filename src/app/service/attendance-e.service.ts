import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Frontend DTOs
export interface AttendanceHistoryItem {
  workDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalMinutes?: number;
  status: string;
  dayOfWeek?: string;
  lateMinutes?: number;
}

export interface QrGenerateResponse {
  token: string;
  qrPayload: string;
  message: string;
}

export interface AttendanceReportDetailRow {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  workingDays: number;
  lateCount: number;
  unpaidLeaveDays: number;
  onTimeRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost:9090/api/attendance';
  private reportUrl = 'http://localhost:9090/api/attendance/report';

  constructor(private http: HttpClient) {}

  // Check-in (frontend gọi checkin())
checkin(payload: any) {
  return this.http.post(
    `${this.apiUrl}/check-in`,
    payload,
    {
      responseType: 'text'
    }
  );
}



  // Check-out (frontend gọi checkout())
 checkout(deviceInfo: string, locationInfo: string) {
  return this.http.post(
    `${this.apiUrl}/check-out`,
    null,
    { responseType: 'text' }
  );
}

  // Lấy lịch sử chấm công (backend trả AttendanceHistoryDto)
  getHistory(): Observable<AttendanceHistoryItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`).pipe(
      map(list => list.map(item => ({
        workDate: item.workDate, // LocalDate serialized as "YYYY-MM-DD"
        checkInTime: item.checkIn ? formatTimeFromIso(item.checkIn) : undefined,
        checkOutTime: item.checkOut ? formatTimeFromIso(item.checkOut) : undefined,
        totalMinutes: item.totalMinutes ?? 0,
        status: normalizeStatus(item.status),
        dayOfWeek: item.workDate ? new Date(item.workDate).toLocaleDateString('vi-VN', { weekday: 'long' }) : ''
      })))
    );
  }

  // Tạo QR (frontend gọi generateQR(employeeId))
  generateQR(employeeId: number): Observable<QrGenerateResponse> {
    return this.http.post<QrGenerateResponse>(`${this.apiUrl}/qr/generate/${employeeId}`, null);
  }

  // Quét QR (frontend gọi scanQR(token))
  scanQR(token: string): Observable<{ message: string }> {
    // backend scan endpoint chấp nhận { token } hoặc { maQRCode }
    return this.http.post<{ message: string }>(`${this.apiUrl}/qr/scan`, { token });
  }

  // Báo cáo summary
  reportSummary(filter: { tuNgay?: string; denNgay?: string; maNhanVien?: number }): Observable<any> {
    return this.http.post<any>(`${this.reportUrl}/summary`, filter);
  }

  // Báo cáo detail
  reportDetail(filter: { tuNgay?: string; denNgay?: string; maNhanVien?: number }): Observable<AttendanceReportDetailRow[]> {
    return this.http.post<AttendanceReportDetailRow[]>(`${this.reportUrl}/detail`, filter);
  }
}

// Helper: format ISO datetime -> "HH:mm"
function formatTimeFromIso(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Helper: map status từ backend sang tiếng Việt hiển thị
function normalizeStatus(s: string): string {
  if (!s) return '-';
  const t = s.toUpperCase();
  if (t === 'PRESENT') return 'Có mặt';
  if (t === 'LATE') return 'Đi muộn';
  if (t === 'EARLY') return 'Về sớm';
  if (t === 'ABSENT') return 'Vắng';
  if (t === 'LEAVE') return 'Nghỉ';
  return s;
}
