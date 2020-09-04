import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserDetails} from '../../authentication/model/user.details';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {

  constructor(private http: HttpClient) {  }

  getAvailableProcessForCase(containerId: string, caseId: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}/processes/instances`;
    return this.http.get<any[]>(url , { headers: headers, params : new HttpParams() });
  }

  setProcessVariable(container: string, processInstanceId: string, varName: string, varValue: string): void {
    const url = `${environment.baseUrl}/containers/${container}/processes/instances/${processInstanceId}/variables`;
    this.http.post<any[]>(url, {'closureStatus' : varValue}, {headers: this.getHeaders()})
      .subscribe(res => { console.error('Updated Process Value', res); });
  }

  getProcessVariable(container: string, processInstanceId: string, varName: string): Observable<any> {
    const url = `${environment.baseUrl}/containers/${container}/processes/instances/${processInstanceId}/variables`;
    return this.http.get<any[]>(url, { headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
