import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {

  constructor(private http: HttpClient) {  }

  uploadDocument(containerId: string, caseId: string, _documents: Array<any>): Observable<any> {
    const url = `${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}/caseFile`;
    const  documents = {  'documents' : _documents };
    return this.http.post<any[]>(url , documents);
  }

  getDocument(containerId: string, caseId: string): Observable<any> {
    const url = `${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}/caseFile`;
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
