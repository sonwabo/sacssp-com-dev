import {Component, Input, OnInit} from '@angular/core';

import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    {{status}}
  `,
})
export class CaseDataRenderComponent implements ViewCell, OnInit {
  status: string;
  @Input() value: number;
  @Input() rowData: any;

  constructor(/*private caseService: CaseService*/) {
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
    }
  }
}
