import { Component, Input, OnInit} from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
    {{selectedValue}}
  `,
})
export class DocTypeComponent implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;

  selectedValue: string;


  ngOnInit() {
    this.selectedValue = this.value;
  }

}
