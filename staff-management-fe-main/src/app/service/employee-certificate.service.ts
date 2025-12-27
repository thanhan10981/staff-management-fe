import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeCertificateService {

  private apiUrl = 'http://localhost:9090/api/ChungChi';

  constructor(private http: HttpClient) {}

  getCertificatesByEmployee(maNhanVien: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nhanvien/${maNhanVien}`);
  }
}
