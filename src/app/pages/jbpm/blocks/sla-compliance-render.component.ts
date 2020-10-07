import {Component, Input, OnInit} from '@angular/core';

import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    <span [ngClass]="classToApply">{{status}}</span>
  `,
  styles: [`
    .violation {
      color: red;
    }

    .tobebreached {
      color: orange;
    }

    .fine {
      color: green;
    }

    .super {
      color: blue;
    }
  `,
  ],
})
export class SlaComplianceRenderComponent implements ViewCell, OnInit {
  status: string;
  @Input() value: number;
  @Input() rowData: any;

  classToApply = '';

  ngOnInit() {

    const num: number =  Number(this.value);

    if (this.rowData['case-status'] === 2 || this.rowData['case-status'] === 3 || this.rowData['case-status'] === 4 ) {
      this.status = 'SLA fulfilled';
      this.classToApply = 'super';
      return;
    }

    if (this.rowData['case-status'] === 1 && this.rowData['case-sla-due-date'] === undefined ) {
      this.status = 'Unknown';
      return;
    }

    if (num === 0 || num < 0) {
      this.status = 'SLA breached';
      this.classToApply = 'violation';
      return;
    } else if (num === 2) {
      this.status = '48hours- to SLA breach';
      this.classToApply = 'tobebreached';
    } else if (num <= 6) {
      this.status = '48hours+ to SLA breach';
      this.classToApply = 'fine';
    } else if (num >= 7) {
      this.status = 'SLA is in range';
      this.classToApply = 'super';
    } else {
      console.log( 'Itts in here gha' );
      this.status = 'Unknown';
    }
  }
}
