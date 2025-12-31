import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApprovalModel } from "../model/model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ApprovalService {

  private api = 'http://localhost:9090/api/approval';

  constructor(private http: HttpClient) {}

  // ✅ ĐÚNG API
  getPendingApprovals(): Observable<ApprovalModel[]> {
  return this.http.get<ApprovalModel[]>(this.api);
}

  approve(id: number, type: string) {
    return this.http.put(
      `${this.api}/${type}/${id}/approve`,
      {}
    );
  }

  reject(id: number, type: string) {
    return this.http.put(
      `${this.api}/${type}/${id}/reject`,
      {}
    );
  }
}
