import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
