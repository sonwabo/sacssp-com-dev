import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';
import {CaseService} from '../../../jbpm/service/case.service';

@Component({
    template: `
  {{status}}
  `,
})
export class CaseStatusRenderComponent implements ViewCell, OnInit {
    status: string;
    @Input() value: number;
    @Input() rowData: any;

    constructor(private caseService: CaseService) {
    }

    ngOnInit() {

        switch (this.value) {
            case 1:
                this.status = 'Open';
                break;
            case 2:
                this.status = 'Closed';
                break;
            case 3:
                this.status = 'Completed';
                break;
            case 4:
                this.status = 'Cancelled';
                break;
            default:
                this.status = 'Unknown';
                break;
        };

      // this.caseService.getTasks(this.rowData['container-id'], this.rowData['case-id']).subscribe(
      //   res => {
      //     const taskSummaries = res['task-summary'];
      //     taskSummaries.sort((a, b) =>   a['task-id'] < b['task-id'] ? -1 : a['task-id'] > b['task-id'] ? 1 : 0);
      //     const finalTask = taskSummaries[taskSummaries.length === 0 ? 0 : taskSummaries.length - 1];
      //     this.status = finalTask['task-status'];
      //   },
      //);
    }
}
