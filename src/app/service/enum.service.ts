// src/app/core/services/enum.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnumItem } from '../model/enum.model';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  private readonly baseUrl = 'http://localhost:9090/api/enums';

  constructor(private http: HttpClient) {}

  getTimeRanges(): Observable<EnumItem[]> {
    return this.http.get<EnumItem[]>(`${this.baseUrl}/loai-thong-ke-ngay-cong`);
  }
}
