import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private http: HttpClient) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/queries/cases/instances`);
  }

  getProcess(containerId: string, caseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}/processes/instances`);
  }

  getTasks(containerId: string, caseId: string): Observable<any[]> {
    return this.getProcess(containerId, caseId).pipe(
      flatMap((processes: any[]) => {
        const headers = new HttpHeaders();

        const params = new HttpParams()
          .append('status', 'Created')
          .append('status', 'Ready')
          .append('status', 'Reserved')
          .append('status', 'InProgress')
          .append('status', 'Suspended')
          .append('status', 'Completed')
          .append('status', 'Failed')
          .append('status', 'Error')
          .append('status', 'Exited')
          .append('status', 'Obsolete');

        return this.http.get<any[]>(`${environment.baseUrl}/queries/tasks/instances/process/${processes['process-instance'][0]['process-instance-id']}`, { headers: headers, params : params });
      }),
    );
  }

  getCaseModel(containerId: string, caseId: string): Observable<any> {
    return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}/caseFile/request`);
  }

  getCaseInstances(containerId: string, caseDefId: string): Observable<any> {
    const headers = new HttpHeaders();
    const params = new HttpParams();
    // return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/${caseDefId}/instances`, {
      return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/instances`, {
      headers: headers,
      params: params,
    });
  }

  getCase(containerId: string, caseId: string): Observable<any> {
    const headers = new HttpHeaders();
    const params = new HttpParams()
    .append('withData', 'true')
    .append('withRoles', 'true')
    .append('withMilestones', 'true')
    .append('withStages', 'true');
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}`, { headers: headers, params : params });
  }

  createCase(containerId: string, caseDefinition: string, administrator?: string, manager?: string): Observable<any> {
  //  const case_ass = {'administrator' : UserDetails.owner, 'reviewer': UserDetails.owner};
    const case_ass = {'administrator' : environment.administrator, 'reviewer': environment.reviewer };
    const data = {};
    const group = {};
    const restrictions = {};
    // @ts-ignore
    const url = `${environment.baseUrl}/containers/${containerId}/cases/${caseDefinition}/instances`;
    return this.http.post<any[]>(url ,  {
      'case-data': data,
      'case-user-assignments': case_ass,
      'case-group-assignments': group,
      'case-data-restrictions': restrictions  } );
  }

  closeCase(containerId: string, caseId: string):  Observable<any> {
    const headers = new HttpHeaders();
    const params = new HttpParams();

    const url = `${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}`;

    return this.http.post<any[]>(url, { headers: headers, params : params } );
  }

  search(_url: string, method: string, body: string ): Observable<any> {
    const url = `${environment.baseUrl}${_url}`;
    if (method === 'post') {
        return   this.http.post<any[]>(url, body);
    }
    if (method === 'put') {
      return   this.http.post<any[]>(url, body);
    }
    if (method === 'get') {
      return   this.http.get<any[]>(url, {});
    }
    return null;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
