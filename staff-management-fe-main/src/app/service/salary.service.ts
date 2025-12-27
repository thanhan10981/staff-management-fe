import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private API_URL = 'http://localhost:9090/api/luong';

  constructor(private http: HttpClient) {}

  getSalaryByEmployeeId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/nhanvien/${id}`);
  }
}
