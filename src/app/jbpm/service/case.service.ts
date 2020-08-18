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
    return this.http.get<any[]>('/kie-server/services/rest/server/queries/cases/instances');
  }

  getProcess(containerId: string, caseId: string): Observable<any[]> {
    return this.http.get<any[]>('/kie-server/services/rest/server/containers/' + containerId + '/cases/instances/' + caseId + '/processes/instances');
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

        return this.http.get<any[]>('/kie-server/services/rest/server/queries/tasks/instances/process/' + processes['process-instance'][0]['process-instance-id'], { headers: headers, params : params })
      })
    )
  }

  getCaseModel(containerId: string, caseId: string): Observable<any>{
    return this.http.get<any[]>('/kie-server/services/rest/server/containers/' + containerId + '/cases/instances/' + caseId + '/caseFile/request');
  }

  getCase(containerId: string, caseId: string): Observable<any>{
    let headers = new HttpHeaders();
    let params = new HttpParams()
    .append("withData", "true")
    .append("withRoles", "true")
    .append("withMilestones", "true")
    .append("withStages", "true");

    return this.http.get<any[]>('/kie-server/services/rest/server/containers/' + containerId + '/cases/instances/' + caseId , { headers: headers, params : params });
  }

}