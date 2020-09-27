import {Component, Input, OnInit} from '@angular/core';

import {ViewCell} from 'ng2-smart-table';
import {DepartmentManagementService} from '@app/jbpm/service/department-management.service';

@Component({
  template: `
    {{department}}
  `,
})
export class DepartmentRenderComponent implements ViewCell, OnInit {
  department: string;
  @Input() value: any;
  @Input() rowData: any;

  constructor(private service: DepartmentManagementService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    if (this.rowData['kind'] === 'SCHEME_OFFICIAL') {
      this.service.getDepartment(this.value?.division?.href).subscribe(res => {
        this.department = res?.name;
        console.log(' <<<<<<<<<<<<<< Res >>>>>>>>>>>>>');
        console.log( res.name );
      });
    }
  }
}
