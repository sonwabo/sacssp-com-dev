import {environment} from '@environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {

  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<any> {
    const url = `${environment.baseBackEnd}/users`;
    return this.http.get<any[]>(url, {headers: this.getHeaders()});
  }

  getFundAdministrators(): Observable<any> {
    const url = `${environment.baseBackEnd}/fundAdministrators`;
    return this.http.get<any[]>(url, {headers: this.getHeaders()});
  }

  getDivisions(): Observable<any> {
    const url = `${environment.baseBackEnd}/divisions`;
    return this.http.get<any[]>(url, {headers: this.getHeaders()});
  }

  getSchemes(): Observable<any> {
    const url = `${environment.baseBackEnd}/schemes`;
    return this.http.get<any[]>(url, {headers: this.getHeaders()});
  }

  getSchema(): Observable<any> {
    const url = `${environment.baseBackEnd}/profile/users`;
    return this.http.get<any[]>(url, {headers: this.getHeaders()});
  }


  getUsers(api: string): Observable<any> {
    const url = `${environment.baseBackEnd}/${api}`;
    return this.http.get<any[]>(url, {headers: this.getHeaders()});
  }

  getUser(location: string): Observable<any> {
    return this.http.get<any[]>(location, {headers: this.getHeaders()});
  }

  createUser(user: any, api: string ): Observable<any> {
    const url = `${environment.baseBackEnd}/${api}`;
    return this.http.post<any[]>(url, user, {headers: this.getHeaders()});
  }

  updateUser(location: string, user: any ): Observable<any> {
    return this.http.put<any[]>(location, user, { headers: this.getHeaders() });
  }

  deleteUser(location: string): Observable<any> {
    return this.http.delete(location, {headers: this.getHeaders()});
  }

  updateDueDate(caseid: string, dueDate: number ) {
    const url = `${environment.baseBackEnd}/updateDueDate?caseid=${caseid}&dueDate=${dueDate}`;
    return this.http.post<any[]>(url,  { headers: this.getHeaders() }).subscribe(res => {
        console.log('Update Date');
        console.log( res );
    });
  }

  sendNotification(caseid: string, user: string): void {
    const url = `${environment.baseBackEnd}/sendNotification`;
    this.http.post<any[]>(url,  {caseid: caseid, user: user}, { headers: this.getHeaders() })
      .subscribe(res => {
    });
  }

  getUserCaseFile(caseid: string): Observable<any> {
    const url = `${environment.baseBackEnd}/getCaseFile?caseid=${caseid}`;
    console.log('URL ' + url);
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
