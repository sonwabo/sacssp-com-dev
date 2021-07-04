import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Document} from '@app/jbpm/domain/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {

  constructor(private http: HttpClient) {  }

  uploadDocument(document: Document): Observable<any> {
    const url = `${environment.baseBackEnd}/v1/uploadAttachment`;
    return this.http.post<any[]>(url , document);
  }

  deleteDocument(document: Document): Observable<any> {
    const url = `${environment.baseBackEnd}/v1/deleteAttachment`;
    return this.http.post<any[]>(url , document);
  }

  getDocuments(reference: string): Observable<any> {
    const url = `${environment.baseBackEnd}/v1/getPartyAttachments?reference=${reference}`;
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
