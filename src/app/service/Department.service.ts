import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private urlkhoa = 'http://localhost:9090/api/khoa';
  private urlvitri = 'http://localhost:9090/api/vitri';
  private urlphongban = 'http://localhost:9090/api/phongban';

  constructor(private http: HttpClient) {}

  getDepartments() {
    return this.http.get<any[]>(this.urlkhoa);
  }
  getAllPhongBan() {
    return this.http.get<any[]>(this.urlphongban);
  }
  getAllViTri() {
    return this.http.get<any[]>(this.urlvitri);
  }
  getPhongBanTheoKhoa(maKhoa: number) {
  return this.http.get<any[]>(
    `${this.urlphongban}/khoa/${maKhoa}`
  );
}

}
