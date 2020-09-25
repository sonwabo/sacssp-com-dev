import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

import { ViewCell } from 'ng2-smart-table';
import {Document} from '@app/jbpm/domain/document';

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

    const linkSource = `data:application/pdf;base64,${this.value}`;
    const downloadLink = document.createElement('a');
    const fileName = doc.name;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

  }
  ngAfterViewInit() {
  }
}
