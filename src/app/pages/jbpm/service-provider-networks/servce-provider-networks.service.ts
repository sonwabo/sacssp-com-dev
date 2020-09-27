import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServceProviderNetworksService {

  constructor(private http: HttpClient) {      }

  readonly api: string  = 'serviceProviderNetworks';

  getServiceProviderNetworks(): Observable<any> {
    const url = `${environment.baseBackEnd}/${this.api}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  addServiceProviderNetworks(spn: any): Observable<any> {
    const url = `${environment.baseBackEnd}/${this.api}`;
    return this.http.post<any[]>(url, spn, { headers: this.getHeaders() });
  }

  updateServiceProviderNetworks(location: string, department: any ): Observable<any> {
    return this.http.put<any[]>(location, department, { headers: this.getHeaders() });
  }

  deleteServiceProviderNetworks(location: string): Observable<any> {
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
