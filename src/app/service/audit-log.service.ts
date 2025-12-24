import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditLogService {

  private api = 'http://localhost:9090/api/AuditLog';

  constructor(private http: HttpClient) {}

  getLogsByEmployee(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/nhanvien/${id}`);
  }
  getAllLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}
