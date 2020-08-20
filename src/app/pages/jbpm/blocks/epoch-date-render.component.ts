import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
    template: `
  {{dateString | date : 'dd/MM/yy hh:mm a'}}
  `,
})
export class EpochDateRenderComponent implements ViewCell, OnInit {
    @Input() value: any;
    @Input() rowData: any;
    dateString: string;


    ngOnInit() {
      if (this.value && this.value['java.util.Date']) {
        this.dateString = this.value['java.util.Date'];
      } else  if (this.value) {
        this.dateString = this.value;
      }
    }
}
