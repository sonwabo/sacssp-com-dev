import {environment} from 'app/../environments/environment';
import {Component} from '@angular/core';
import {CaseService} from 'app/jbpm/service/case.service';
import {ServerDataSource} from 'ng2-smart-table';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserDetails} from 'app/authentication/model/user.details';
import {TaskService} from 'app/jbpm/service/task.service';
import {case_table_settings, task_table_settings} from './table-settings';
import {JWTTokenService} from 'app/jbpm/service/JWTTokenService';
import {UserRoles} from 'app/authentication/model/user-roles';

@Component({
  selector: 'ngx-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss'],
})
export class CasesTableComponent {

  static CASES: string = 'Cases';
  source: ServerDataSource;
  taskSource: ServerDataSource;
  loading: boolean = true;

  settings = case_table_settings;
  taskSettings = task_table_settings;
  reviewer: boolean = (UserDetails.getRoles().includes(UserRoles.OPS_USER_ROLE));

  constructor(
    private jwtService: JWTTokenService,
    protected service: CaseService,
    protected taskService: TaskService,
    protected router: Router,
    protected http: HttpClient) {

    this.loadCases();
  }

  loadCases(allCases: boolean = false): void {
    this.source = new ServerDataSource(this.http,
      {
        endPoint: `${environment.baseUrl}/queries/cases/instances?dataItemValue=${environment.caseDefinition}&owner=${UserDetails.getUserName()}`,
        dataKey: 'instances'
      });
    this.taskSource = new ServerDataSource(this.http,
      {
        endPoint: `${environment.baseUrl}/queries/tasks/instances/pot-owners?user=${UserDetails.getUserName()}`,
        dataKey: 'task-summary'
      });
    this.source.getElements().then(value => {
      this.isLoading(false);
    });
  }

  onEdit(event): void {
    this.isLoading(true);
    const _data = event.data;
    this.router.navigate(['pages/jbpm/case-detail'], {state: {data: {case: _data}}});
    this.isLoading(false);
  }

  onCreateConfirm(event) {
    this.isLoading(true);
    this.service.createCase(environment.containerId, environment.caseDefinition).subscribe(res => {
      this.loadCases();
      this.source.load;
      this.service.getCase(environment.containerId, res).subscribe(_res => {
        this.router.navigate(['pages/jbpm/case-detail'], {state: {data: {case: _res}}});
        this.isLoading(false);
      });
    }, err => {
    });
  }

  private isLoading(loading: boolean): void {
    this.loading = loading;
  }

  onSelectedTab(_event: any): void {
    this.loadCases((_event.tabTitle === CasesTableComponent.CASES));
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'Status',
        search: query,
      },
      {
        field: 'Owner',
        search: query,
      },
      {
        field: 'Description',
        search: query,
      },

    ], false);
  }

}

