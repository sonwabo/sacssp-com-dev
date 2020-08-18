import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>('/kie-server/services/rest/server/queries/tasks/instances');
  }

  getTaskComments(containerId: string, taskInstanceId: string): Observable<any[]>{
    return this.http.get<any[]>('/kie-server/services/rest/server/containers/' + containerId + '/tasks/' + taskInstanceId + '/comments');
  }

}