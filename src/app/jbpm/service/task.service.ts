import { CustomKeys } from './../domain/demand';
import { HeaderComponent } from './../../@theme/components/header/header.component';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskInputs } from '../domain/demand';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/queries/tasks/instances`);
  }

  getTaskComments(containerId: string, taskInstanceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/tasks/${taskInstanceId}/comments`);
  }

  attachComment(containerId: string, taskInstanceId: string, comments: string): Observable<any> {
    const  comment = {  'comment-id' : 'null',
                        'comment-added-by': 'fund-administrator',
                        'comment': comments};
    const url = `${environment.baseUrl}/containers/${containerId}/tasks/${taskInstanceId}/comments`;
    return this.http.post<any[]>(url, comment);
  }

  getTaskInformation(container: string, taskid: string): Observable<any[]> {
      const url = `${environment.baseUrl}/queries/tasks/instances/${taskid}`;
      return this.http.get<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() });
  }

  claimTask(container: string, taskid: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/claimed`;
    this.http.put<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() })
      .subscribe(res => { console.error('Task Claimed ' , res ); });
  }

  startClaimedTask(container: string, taskid: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/started`;
    this.http.put<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() })
      .subscribe(res => { console.error('Start Claimed Task', res); });
  }

  completeClaimedTask(container: string, taskid: string, taskInputes: TaskInputs): Observable<any> {

    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/completed`;
    const request = {'io.jumpco.metropolitan.requesttracker.Demand' : taskInputes.demand };
    return this.http.put<any[]>(url, {'request' : request , status : taskInputes.status} );
  }

  private getHeaders(): HttpHeaders {
    const headerStr = `Basic ` + btoa(`${environment.username}:${environment.password}`);
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: headerStr
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
