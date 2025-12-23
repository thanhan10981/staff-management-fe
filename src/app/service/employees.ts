import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EmployeeModel } from '../model/model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:9090/api';   

  constructor(private http: HttpClient) {}

  // Lấy toàn bộ nhân viên
  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(`${this.apiUrl}/NhanVien`);
  }

  // Lấy theo ID
  getEmployeeById(id: number): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(`${this.apiUrl}/NhanVien/${id}`);
  }

  // Thêm nhân viên
  createEmployee(emp: EmployeeModel): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(`${this.apiUrl}/NhanVien`, emp);
  }

  // Cập nhật nhân viên
  updateEmployee(id: number, emp: EmployeeModel): Observable<EmployeeModel> {
    return this.http.put<EmployeeModel>(`${this.apiUrl}/NhanVien/${id}`, emp);
  }

  // Xóa nhân viên
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/NhanVien/${id}`);
  }

}
