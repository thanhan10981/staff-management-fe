import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private API_URL = 'http://localhost:9090/api/schedules';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // ============================================================
  // GET LỊCH THEO THÁNG (FE Calendar dùng API này)
  // ============================================================
  getSchedules(year: number, month: number, phongId?: number, caId?: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`, {
      params: {
        year,
        month,
        ...(phongId ? { phongId } : {}),
        ...(caId ? { caId } : {})
      }
    });
  }

  // ============================================================
  // GET LỊCH THEO NGÀY (Day Detail)
  // ============================================================
  getDay(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/range`, {
      params: {
        start: date,
        end: date
      }
    });
  }

  // ============================================================
  // GET LỊCH THEO USER (nếu backend có API)
  // ============================================================
  getUserSchedule(employeeId: number): Observable<any[]> {
    // Nếu backend chưa có API này → COMMENT LẠI
    return this.http.get<any[]>(`${this.API_URL}/user/${employeeId}`);
  }

  // ============================================================
  // CREATE SCHEDULE
  // ============================================================
  createSchedule(payload: any): Observable<any> {
    const actorId = this.auth.currentUserId() ?? 0;

    return this.http.post<any>(
      `${this.API_URL}?actorId=${actorId}`,
      payload
    );
  }

  // ============================================================
  // DELETE
  // ============================================================
  deleteSchedule(id: number): Observable<void> {
    const actorId = this.auth.currentUserId() ?? 0;

    return this.http.delete<void>(
      `${this.API_URL}/${id}?actorId=${actorId}`
    );
  }
}
