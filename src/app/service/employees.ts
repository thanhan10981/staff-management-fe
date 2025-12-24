  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  import { EmployeeModel } from '../model/model';


  @Injectable({
    providedIn: 'root'
  })
  export class EmployeeService {

    private apiUrl = 'http://localhost:9090/api/NhanVien';   

    constructor(private http: HttpClient) {}

    // Lấy toàn bộ nhân viên
    getAllEmployees(): Observable<EmployeeModel[]> {
      return this.http.get<EmployeeModel[]>(`${this.apiUrl}`);
    }

    // Lấy theo ID
    getEmployeeById(id: number): Observable<EmployeeModel> {
      return this.http.get<EmployeeModel>(`${this.apiUrl}/${id}`);
    }

    // Thêm nhân viên
    createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, employee);
    }

    deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }


    updateEmployee(id: number, emp: EmployeeModel) {
      return this.http.put(`${this.apiUrl}/${id}`, emp);
    }
    importExcel(formData: FormData) {
    return this.http.post('http://localhost:9090/api/NhanVien/import-excel', formData);
  }

  }
      