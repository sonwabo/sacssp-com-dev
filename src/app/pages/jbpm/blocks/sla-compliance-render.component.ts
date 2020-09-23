import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
    template: `
  {{status}}
  `,
})
export class SlaComplianceRenderComponent implements ViewCell, OnInit {
    status: string;
    @Input() value: number;
    @Input() rowData: any;

    ngOnInit() {
        switch (this.value) {
            case 0:
                this.status = 'NA';
                break;
            case 1:
                this.status = 'Pending';
                break;
            case 2:
                this.status = 'Met';
                break;
            case 3:
                this.status = 'Violated';
                break;
            case 4:
                this.status = 'Aborted';
                break;
            default:
                this.status = 'Unknown';
                break;
        }
    }
}
