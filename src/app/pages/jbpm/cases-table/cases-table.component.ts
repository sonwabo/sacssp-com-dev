import { Component } from '@angular/core';
import { CaseService } from '../../../jbpm/service/case.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CaseStatusRenderComponent } from '../blocks/case-status-render.component';
import { SlaComplianceRenderComponent } from '../blocks/sla-compliance-render.component';
import { EpochDateRenderComponent } from '../blocks/epoch-date-render.component';

@Component({
  selector: 'ngx-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss'],
})
export class CasesTableComponent {

  settings = {
    mode: 'external',
    actions: {
      add: true,
      edit: true,
      delete: false,
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
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
      }
    },
  };

  //source: LocalDataSource;
  source: ServerDataSource;

  constructor(
    protected service: CaseService,
    protected router: Router,
    protected http: HttpClient) {
    //this.source = new LocalDataSource();

    //this.service.getCases().subscribe(
    //data => this.source.load(data['instances'])
    //)    

    this.source = new ServerDataSource(http, { endPoint: '/kie-server/services/rest/server/queries/cases/instances', dataKey: 'instances' });
  }

  onEdit(event): void {
    this.router.navigate(['pages/jbpm/case-detail'],
      { state: { data: { case: event.data } } });
  }
}
