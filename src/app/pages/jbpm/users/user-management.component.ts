import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {UserManagementService} from '../../../jbpm/service/user-management.service';
import {LocalDataSource, ServerDataSource} from 'ng2-smart-table';
import {users_management_table_settings} from './user-utils';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ngx-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();
  dataArray: Array<any> = new Array<any>();
  settings = users_management_table_settings;
  userForm: FormGroup;

  fundAdministrators: Array<any> = new Array<any>();
  schemes: Array<any> = new Array<any>();
  divisions: Array<any> = new Array<any>();

  isfundAdministrators: boolean = false;
  isUpdate: boolean = false;


  submitted = false;

  userTypes: any[] = [
      { value: 'SCHEMEOFFICIAL', description: 'Scheme Official' }
    , { value: 'OPERATIONS', description: 'Operations User' }
    , { value: 'OPERATIONS_HOD', description: 'Operations HOD' }
    , { value: 'FUND_ADMINISTRATOR', description: 'Fund Administrator' }
    , { value: 'FUND_MANAGER', description: 'Fund Manager' },
  ];

  constructor(private formBuilder: FormBuilder, protected http: HttpClient, private service: UserManagementService) {

    this.service.getAllUsers().subscribe(value => {
      for (const index of value['_embedded']['fundManagers']) { this.dataArray.push(index); }
      for (const index of value['_embedded']['fundAdministrators']) { this.dataArray.push(index); }
      for (const index of value['_embedded']['operationses']) { this.dataArray.push(index); }
      for (const index of value['_embedded']['operationsHods']) { this.dataArray.push(index); }
      for (const index of value['_embedded']['schemeOfficials']) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });
  }

  private initialiseForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      kind: ['', Validators.required],
      fundAdministrator: ['', Validators.required],
      scheme: ['', Validators.required],
      email: ['', Validators.required] });
  }

  get form() { return this.userForm.controls; }

  ngOnInit(): void { this.initialiseForm(); }

  ngAfterViewInit() {
    this.service.getFundAdministrators().subscribe(res => {
      for ( const value of res['_embedded']['fundAdministrators'] ) { this.fundAdministrators.push(value); }
    });
    this.service.getDivisions().subscribe(res => {
      for (const value of res['_embedded']['divisions']) {this.divisions.push(value); }
    });
    this.service.getSchemes().subscribe(res => {
      for (const value of res['_embedded']['schemes']) {this.schemes.push(value); }
    });
  }

  onEdit(event: any): void {  this.populateFields( event.data ); }

  private populateFields(data: any): void {
    if ( data['_links']) { this.isUpdate = true; }
    console.error('>>>>>>>>>>>> ::: ');
    console.error(data['_links']);
    console.error(data);
    this.userForm.controls['name'].setValue(data['name']);
    this.userForm.controls['surname'].setValue(data['surname']);
    this.userForm.controls['email'].setValue(data['email']);
    this.userForm.controls['kind'].setValue(this.getValue(data['kind']));
    // this.userForm.controls['fundAdministrator'].setValue(request['']);
  }

  getValue(value_: string): string {
    console.error('<<<<<< kk >>>>>>');
    console.error(value_);
    let str = '';
    for (const v of this.userTypes) {
       if ( v.value === value_) {
          str = v.description;
       }
    }
    console.error('<<<<<< ooo >>>>>>');
    console.error(str);
    return str;
  }

  formSubmit(form: FormGroup): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.service.createSchemeOfficial(form.value).subscribe(value => {
      this.source.prepend(form.value);
      this.onReset();
    });
  }

  selectedValue(event: any): void {
    this.isfundAdministrators = ('SCHEMEOFFICIAL' === event.value);
    console.error(this.fundAdministrators);
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
    this.isfundAdministrators = false;
  }
}
