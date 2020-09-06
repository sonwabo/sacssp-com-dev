import {CustomKeys, CaseRequest} from './../domain/demand';
import { HeaderComponent } from './../../@theme/components/header/header.component';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserDetails} from '../../authentication/model/user.details';


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
                        'comment-added-by': UserDetails.owner,
                        'comment': comments};
    const url = `${environment.baseUrl}/containers/${containerId}/tasks/${taskInstanceId}/comments`;
    return this.http.post<any[]>(url, comment);
  }

  getTaskInformation(container: string, taskid: string): Observable<any[]> {
      const url = `${environment.baseUrl}/queries/tasks/instances/${taskid}`;
      return this.http.get<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() });
  }

  getTaskInputs(containerId: string, taskid: string): Observable<any[]> {
    const url = `${environment.baseUrl}/containers/${containerId}/tasks/${taskid}/contents/input`;
    return this.http.get<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() });
  }

  activateTask(container: string, taskid: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/activated`;
    const params = new HttpParams();
    params.set('user', UserDetails.owner);

    this.http.put<any[]>(url, { headers: this.getHeaders(), params })
      .subscribe(res => { console.error('Task Activated ' , res ); });
  }

  claimTask(container: string, taskid: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/claimed`;
    const params = new HttpParams();
    params.set('user', UserDetails.owner);

    this.http.put<any[]>(url, { headers: this.getHeaders(), params })
      .subscribe(res => { console.error('Task Claimed ' , res ); });
  }

  startClaimedTask(container: string, taskid: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/started`;
    const params = new HttpParams();
    params.set('user', UserDetails.owner);
    this.http.put<any[]>(url, { headers: this.getHeaders(), params })
      .subscribe(res => { console.error('Start Claimed Task', res); });
  }

  completeClaimedTask(container: string, taskid: string, parentRequest: CaseRequest): Observable<any> {

    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/completed?auto-progress=true&user=${UserDetails.owner}`;
    const request = {'io.jumpco.metropolitan.tracker.demand.Request' : parentRequest.request };
    const settings = {'io.jumpco.metropolitan.tracker.demand.Settings' : parentRequest.settings};
    const documents = {};
    // {'org.jbpm.document.service.impl.DocumentImpl' : parentRequest.attachments};
    let  body = {
      status : parentRequest.status,
      'request' : request,
      'settings' : settings,
      'attachments' : {documents : []},
    };

    if ( parentRequest.closureStatus ) {
      // @ts-ignore
      body = {'closeCase': parentRequest.closureStatus};
    }

    return this.http.put<any[]>(url, body);
  }

  releaseTask(container: string, taskid: string):  Observable<any> {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/released`;
    const params = new HttpParams();
    params.set('user', UserDetails.owner);
    return this.http.put<any[]>(url, { headers: this.getHeaders(), params });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
