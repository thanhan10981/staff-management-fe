import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OTM {
  constructor(private http: HttpClient) {}

 updateOTAndAllowance(list: any[]) {
  return this.http.put(
    'http://localhost:9090/api/dashboard/salary/update-ot-allowance',
    list,
    { responseType: 'text' }
  );
}

}


