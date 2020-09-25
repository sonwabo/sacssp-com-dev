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

  addDivisions(): Observable<any> {
    const url = `${environment.baseBackEnd}/divisions`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getSchemes(): Observable<any> {
    const url = `${environment.baseBackEnd}/schemes`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  addSchemes(): Observable<any> {
    const url = `${environment.baseBackEnd}/schemes`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }


  getServiceProviderNetworks(): Observable<any> {
    const url = `${environment.baseBackEnd}/serviceProviderNetworks`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  addServiceProviderNetworks(): Observable<any> {
    const url = `${environment.baseBackEnd}/serviceProviderNetworks`;
    return this.http.post<any[]>(url, { headers: this.getHeaders() });
  }


  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }
}
