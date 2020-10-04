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
    .super  {
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
    console.log('>>>>>>>>>>>>>>>>>>>> KK ' + this.value);
    console.log( this.rowData );
    if ( !this.value) {
     this.status = 'Unknown';
     return;
    }
    if (this.value === 0 || this.value < 0 ) {
      this.status = 'SLA breached';
      this.classToApply = 'violation';
    } else if (this.value <= 2) {
      this.status = '48hours to SLA breach';
      this.classToApply = 'tobebreached';
    } else if (this.value <= 6) {
      this.status = '48hours+ to SLA breach';
      this.classToApply = 'fine';
    } else if (this.value >= 7) {
      this.status = 'SLA is in range';
      this.classToApply = 'super';
    } else {
      this.status = 'Unknown';
    }
  }
}
