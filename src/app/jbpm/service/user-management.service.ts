import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {

  constructor(private http: HttpClient) {  }

  getAllUsers(): Observable<any> {
    const url = `${environment.baseBackEnd}/users`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }
  
  getFundAdministrators(): Observable<any> {
    const url = `${environment.baseBackEnd}/fundAdministrators`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getDivisions(): Observable<any> {
    const url = `${environment.baseBackEnd}/divisions`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getSchemes(): Observable<any> {
    const url = `${environment.baseBackEnd}/schemes`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }


  getSchemeOfficials(): Observable<any> {
    const url = `${environment.baseBackEnd}/schemeOfficials`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }
  createSchemeOfficial(data: any): Observable<any> {
    const url = `${environment.baseBackEnd}/schemeOfficials`;
    return this.http.post<any[]>(url, data , { headers: this.getHeaders() });
  }


  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }
}
