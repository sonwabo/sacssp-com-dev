import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DivisionManagementService {

  constructor(private http: HttpClient) {      }

  getDivisions(): Observable<any> {
    const url = `${environment.baseBackEnd}/divisions`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getSchemes(): Observable<any> {
    const url = `${environment.baseBackEnd}/schemes`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }



  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }
}
