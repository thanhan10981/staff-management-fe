import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:9090/api/admin/users';

  constructor(private http: HttpClient) {}

  // Lấy danh sách user
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Thêm user
  createUser(payload: any): Observable<any> {
    console.log('CALL API CREATE USER:', payload);
    return this.http.post(this.API_URL, payload);
  }

  // Cập nhật user
  updateUser(userId: number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}`, payload);
  }
  deleteOne(id: number) {
  return this.http.delete(`${this.API_URL}/${id}`);
}

deleteMany(ids: number[]): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/delete-many`,
      ids
    );
  }

}
