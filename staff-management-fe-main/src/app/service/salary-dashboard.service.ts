import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryDashboardService {
  private baseUrl = 'http://localhost:9090/api/dashboard/salary';

  constructor(private http: HttpClient) {}

  // API tổng quan
  getOverview(month: number, year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?month=${month}&year=${year}`);
  }

  // API lấy chi tiết bảng lương
  getSalaryTable(month: number, year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/detail?month=${month}&year=${year}`);
  }

  // API lấy thống kê đi làm đúng giờ
  getChartStats(month: number, year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/chart?month=${month}&year=${year}`);
  }
  calculateSalary(month: number, year: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/calculate?month=${month}&year=${year}`, {});
}
updateHolidayCoef(holidayCoef: number, weekendCoef: number) {
  return this.http.post(
    `${this.baseUrl}/holiday-coef`,
    { holidayCoef, weekendCoef },
    { responseType: 'text' }  
  );
}
exportSalary(month: number, year: number) {
  return this.http.get(
    `${this.baseUrl}/export-salary?month=${month}&year=${year}`,
    { responseType: 'blob' }
  );
}
getRecentActivities() {
  return this.http.get<any[]>(`http://localhost:9090/api/AuditLog/recent`);
}

}
