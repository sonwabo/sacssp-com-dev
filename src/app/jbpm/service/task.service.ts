import { CaseRequest} from './../domain/demand';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from '../../authentication/model/user.details';
import { ProcessService } from './process.service';
import { CaseService } from './case.service';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient, protected processService: ProcessService, private caseService: CaseService) { }

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

  getTaskOutput(containerId: string, taskid: string): Observable<any[]> {
    const url = `${environment.baseUrl}/containers/${containerId}/tasks/${taskid}/contents/output`;
    return this.http.get<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() });
  }


  getTaskInputs(containerId: string, taskid: string): Observable<any[]> {
    const url = `${environment.baseUrl}/containers/${containerId}/tasks/${taskid}/contents/input`;
    return this.http.get<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() });
  }

  // @ts-ignore
  getPotOwnerTasks(): Observable<any> {
    const url = `${environment.baseUrl}/queries/tasks/instances/pot-owners?user=${UserDetails.owner}`;
    return new Observable<any>(obs => {
      this.http.get<any[]>(url, { headers: this.getHeaders(), params : new HttpParams() }).subscribe(value => {
        this.processService.getProcessInformation(value['task-summary'][0]['task-container-id'],
          value['task-summary'][0]['task-proc-inst-id'])
          .subscribe(proces => {
            this.caseService.getCaseInstances(proces['container-id'], proces['process-id'])
              .subscribe( _case =>
                obs.next(_case));
          });
      });
    });
  }


  activateTask(container: string, taskid: string, user?: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/activated`;
    const params = new HttpParams();
    params.set('user', UserDetails.owner);

    if ( user && user !== undefined) {
      params.set('user', user);
    }

    this.http.put<any[]>(url, { headers: this.getHeaders(), params })
      .subscribe(res => { console.error('Task Activated ' , res ); });
  }

  claimTask(container: string, taskid: string, user?: string): void {
    const url = `${environment.baseUrl}/containers/${container}/tasks/${taskid}/states/claimed`;
    const params = new HttpParams();
    params.set('user', UserDetails.owner);

    if ( user && user !== undefined) {
      params.set('user', user);
    }

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

    let  body = {
      status : parentRequest.status,
      'request' : request,
      'settings' : settings,
    };

    if ( parentRequest.closeCase ) {
      request['io.jumpco.metropolitan.tracker.demand.Request'].requestStatus = 'Closed';
      // @ts-ignore
      body = {'closeCase': parentRequest.closeCase,
              'closureStatus' : parentRequest.closureStatus,
              'request': request,
             };
    }
    return this.http.put<any[]>(url, body);
  }

  saveCaseData(container: string, caseid: string, parentRequest: CaseRequest): Observable<any> {
    const url = `${environment.baseUrl}/containers/${container}/cases/instances/${caseid}/caseFile`;

    const request = {'io.jumpco.metropolitan.tracker.demand.Request' : parentRequest.request };
    const settings = {'io.jumpco.metropolitan.tracker.demand.Settings' : parentRequest.settings};

    const  body = {
      status : parentRequest.status,
      'request' : request,
      'settings' : settings,
    };
    return this.http.post<any[]>(url, body, { headers: this.getHeaders()});
  }
  getAvailableTasksForProcess(processid: string): Observable<any> {
    const url = `${environment.baseUrl}/queries/tasks/instances/process/${processid} `;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  delegate(containerId, taskid: string, user?: string): void {
    const url = `${environment.baseUrl}/containers/${containerId}/tasks/${taskid}/states/delegated?user=${UserDetails.owner}&targetUser=${UserDetails.delegateUser}`;
    this.http.put<any[]>(url, { headers: this.getHeaders() })
      .subscribe(res => { console.error('Task Delegated ' , res ); });
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



