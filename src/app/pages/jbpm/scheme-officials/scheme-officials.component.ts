import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {users_management_table_settings} from '../users/user-utils';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {UserManagementService} from '../../../jbpm/service/user-management.service';

@Component({
  selector: 'ngx-scheme-official',
  templateUrl: './scheme-officials.component.html',
  styleUrls: ['./scheme-officials.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchemeOfficialsComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();
  dataArray: Array<any> = new Array<any>();
  settings = users_management_table_settings;

  constructor(private formBuilder: FormBuilder, protected http: HttpClient, private service: UserManagementService) {

    this.service.getSchemeOfficials().subscribe(value => {
      for (const index of value['_embedded']['schemeOfficials']) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });
  }
  ngOnInit(): void {
  }

  onEdit(event: any): void { console.error(event.data); }
}
