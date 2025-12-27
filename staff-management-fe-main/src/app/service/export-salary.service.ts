import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportSalaryService {

  private baseUrl = "http://localhost:9090/api/export/salary";

  constructor(private http: HttpClient) {}

 /** Gọi API lọc dữ liệu */
filterSalary(dept: number, from: string, to: string, keyword: string) {

  return this.http.get<any[]>(`${this.baseUrl}/filter`, {
    params: {
      department: dept,
      from: from,
      to: to,
      keyword: keyword
    }
  });
}


 exportExcel(department: number, from: string, to: string, keyword: string): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/export-excel`, {
    params: { department, from, to, keyword },
    responseType: "blob"
  });
}

}
