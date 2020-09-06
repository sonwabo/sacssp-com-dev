import { environment } from './../../../../environments/environment';
import { Component } from '@angular/core';
import { CaseService } from '../../../jbpm/service/case.service';
import { ServerDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CaseStatusRenderComponent } from '../blocks/case-status-render.component';
import { SlaComplianceRenderComponent } from '../blocks/sla-compliance-render.component';
import { EpochDateRenderComponent } from '../blocks/epoch-date-render.component';
import {UserDetails} from '../../../authentication/model/user.details';

@Component({
  selector: 'ngx-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss'],
})
export class CasesTableComponent {

  static CASES: string = 'Cases';

  settings = {
    mode: 'external',
    actions: {
      add: false,
      edit: true,
      delete: false,
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      'case-id': {
        title: 'ID',
      },
      'case-description': {
        title: 'Description',
      },
      'case-owner': {
        title: 'Owner',
      },
      'case-status': {
        title: 'Status',
        type: 'custom',
        renderComponent: CaseStatusRenderComponent,
      },
      'case-sla-compliance': {
        title: 'SLA',
        type: 'custom',
        renderComponent: SlaComplianceRenderComponent,
      },
      'case-started-at': {
        title: 'Created',
        type: 'custom',
        renderComponent: EpochDateRenderComponent,
      },
      'case-sla-due-date': {
        title: 'Due',
        type: 'custom',
        renderComponent: EpochDateRenderComponent,
      },
      'case-completed-at': {
        title: 'Completed',
        type: 'custom',
        renderComponent: EpochDateRenderComponent,
      },
    },
  };

  source: ServerDataSource;
  loading: boolean = true;

  constructor(
    protected service: CaseService,
    protected router: Router,
    protected http: HttpClient) {
      // tslint:disable-next-line:max-line-length
    this.source = this.loadCases();
  }

  loadCases(allCases: boolean = false): ServerDataSource {
    let datasource: ServerDataSource  = null;

    if (!allCases) {
      datasource = new ServerDataSource(this.http,
        // tslint:disable-next-line:max-line-length
        { endPoint: `${environment.baseUrl}/queries/cases/instances?owner=${UserDetails.owner}`, dataKey: 'instances' });
    } else {
      datasource = new ServerDataSource(this.http,
        { endPoint: `${environment.baseUrl}/queries/cases/instances`, dataKey: 'instances' });
    }
    datasource.getElements().then(value => {
      this.isLoading(false);
    });
    return datasource;
  }

  onEdit(event): void {
    this.isLoading(true);
    const _data = event.data;
    this.router.navigate(['pages/jbpm/case-detail'], { state: { data: { case: _data } } });
    this.isLoading(false);
  }

  onCreateConfirm(event) {
      this.isLoading(true);
      this.service.createCase(environment.containerId, environment.caseDefinition).subscribe(res => {
        this.source = this.loadCases();
        this.source.load;
        this.service.getCase(environment.containerId, res).subscribe(_res => {
            this.router.navigate(['pages/jbpm/case-detail'], { state: { data: { case: _res } } });
            this.isLoading(false);
        });
      }, err => {
          console.error(' ======== Error ======== ');
          console.error( err );
      });
  }

  private isLoading(loading: boolean ): void {
    this.loading = loading;
  }

  onSelectedTab(_event: any): void {
     this.loadCases((_event.tabTitle === CasesTableComponent.CASES) );
  }

}
