import {Component, Input, OnInit} from '@angular/core';

import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    {{kind}}
  `,
})
export class UserKindRenderComponent implements ViewCell, OnInit {
  kind: string;
  @Input() value: string;
  @Input() rowData: any;

  constructor(/*private caseService: CaseService*/) {
  }

  ngOnInit() {

    switch (this.value) {
      case 'SCHEME_OFFICIAL' :
        this.kind = 'Scheme Official';
        break;
      case 'OPERATIONS':
        this.kind = 'Operations User';
        break;
      case 'OPERATIONS_HOD':
        this.kind = 'Operations HOD';
        break;
      case 'FUND_ADMINISTRATOR':
        this.kind = 'Fund Admin';
        break;
      case 'FUND_MANAGER':
        this.kind = 'Fund Manager';
        break;
      default:
        this.kind = 'Unknown';
        break;
    }
  }
}
