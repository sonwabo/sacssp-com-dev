import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

import { ViewCell } from 'ng2-smart-table';
import {Document} from '@app/jbpm/domain/document';

declare var require: any;
const FileSaver = require('file-saver');


@Component({
  template: `
    <span>
       <a href="javascript:void(0);" (click)="downloadDocument()">
         <i class="fas fa-file-pdf fa-3x"></i>
       </a>
     </span>
  `,
})
export class DocumentRenderComponent implements ViewCell, OnInit,  AfterViewInit {
  @Input() value: any;
  @Input() rowData: any;
  dateString: string;


  ngOnInit() {
  }

  downloadDocument(): void {
    const doc = this.rowData as Document;
    FileSaver.saveAs(`data:application/pdf;base64,${this.value}`, doc.name);
  }
  ngAfterViewInit() {
  }
}
