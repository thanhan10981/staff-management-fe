import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuditLog } from '../model/profile.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {

  private api = 'http://localhost:9090/api/AuditLog';

  private recentLogsSubject = new BehaviorSubject<AuditLog[]>([]);
  recentLogs$: Observable<AuditLog[]> = this.recentLogsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getLogsByEmployee(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/nhanvien/${id}`);
  }

loadRecentLogs(): void {
  this.http
    .get<AuditLog[]>(`${this.api}/recent`)
    .subscribe({
      next: (logs) => this.recentLogsSubject.next(logs),
      error: (err) => console.error('Load recent logs failed', err)
    });
}

  getAllLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}
