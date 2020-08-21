import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

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
        let headers = new HttpHeaders();

        let params = new HttpParams()
          .append("status", "Created")
          .append("status", "Ready")
          .append("status", "Reserved")
          .append("status", "InProgress")
          .append("status", "Suspended")
          .append("status", "Completed")
          .append("status", "Failed")
          .append("status", "Error")
          .append("status", "Exited")
          .append("status", "Obsolete");

        return this.http.get<any[]>(`${environment.baseUrl}/queries/tasks/instances/process/${processes['process-instance'][0]['process-instance-id']}`, { headers: headers, params : params })
      }),
    );
  }

  getCaseModel(containerId: string, caseId: string): Observable<any> {
    return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}/caseFile/request`);
  }

  getCase(containerId: string, caseId: string): Observable<any> {
    const headers = new HttpHeaders();
    const params = new HttpParams()
    .append('withData', "true")
    .append('withRoles', "true")
    .append('withMilestones', "true")
    .append('withStages', "true");

    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(`${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}`, { headers: headers, params : params });
  }

  createCase(containerId: string, caseDefinition: string, administrator?: string, manager?: string): Observable<any> {

    const  headers = this.getHeaders();

    const case_ass = {'administrator': 'fund-administrator', 'manager': 'fund-manager' };
    const data = {};
    const group = {};
    const restrictions = {};

    const params = new HttpParams({fromObject : { 'case-data': data,
        'case-user-assignments': case_ass,
        'case-group-assignments': group,
        'case-data-restrictions': restrictions  }  });

    const url = `${environment.baseUrl}/containers/${containerId}/cases/${caseDefinition}/instances`;
    return this.http.post<any[]>(url , { headers: headers, params : params });
  }

  closeCase(containerId: string, caseId: string):  Observable<any> {
    const headers = new HttpHeaders();
    const params = new HttpParams();

    const url = `${environment.baseUrl}/containers/${containerId}/cases/instances/${caseId}`;

    return this.http.post<any[]>(url, { headers: headers, params : params } );
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json'
    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
