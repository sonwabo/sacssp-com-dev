import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentManagementService {

  constructor(private http: HttpClient) {      }

  getDepartment(location: string): Observable<any> {
    return this.http.get<any[]>(location, { headers: this.getHeaders() });
  }
  getDepartments(api: string): Observable<any> {
    const url = `${environment.baseBackEnd}/${api}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  addDepartment(organisation: any, api: string ): Observable<any> {
    const url = `${environment.baseBackEnd}/${api}`;
    return this.http.post<any[]>(url, organisation,  { headers: this.getHeaders() });
  }

  getSchema(api: string): Observable<any> {
    const url = `${environment.baseBackEnd}/profile/${api}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  updateDepartment(location: string, department: any ): Observable<any> {
    return this.http.put<any[]>(location, department, { headers: this.getHeaders() });
  }

  deleteDepartment(location: string): Observable<any> {
    return this.http.delete(location, {headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }
}
