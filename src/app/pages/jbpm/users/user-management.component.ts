import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbGlobalPhysicalPosition, NbStepperComponent, NbToastrService } from '@nebular/theme';
import { UserManagementService } from '../../../jbpm/service/user-management.service';
import { LocalDataSource } from 'ng2-smart-table';
import { users_management_table_settings } from './user-utils';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentManagementService } from '@app/jbpm/service/department-management.service';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';


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
  label: string = 'Add';



  schemes: Array<any> = new Array<any>();
  divisions: Array<any> = new Array<any>();
  fundManagementDepartmentsArray: Array<any> = new Array<any>();
  operationsDepartmentsArray: Array<any> = new Array<any>();

  operationsHODArray: Array<any> = new Array<any>();
  fundManagersArray: Array<any> = new Array<any>();


  isfundAdministrator: boolean = false;
  isOperationsUser: boolean = false;
  isOperationsUserHod: boolean = false;
  isfundManager: boolean = false;

  // Form Validation properties
  isUpdate: boolean = false;
  submitted = false;
  loading = false;


  userTypes: Array<string> = new Array<string>();

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private departmentManagement: DepartmentManagementService,
    private service: UserManagementService) {
    this.loadData();
  }

  loadData(): void {

    this.service.getSchema().subscribe(res => {
      for (const value of res['alps']['descriptor'][0]['descriptor']) {
        if (value?.doc?.value) {
          this.userTypes = (value?.doc?.value.split(',') as Array<string>).filter(val => val.trim() !== 'SCHEME_OFFICIAL');
        }
      }
    });

    this.service.getAllUsers().subscribe(value => {
      (value['_embedded']?.fundManagers as Array<any>)?.forEach(value1 => this.setArrayData(value1));
      (value['_embedded']?.fundAdministrators as Array<any>)?.forEach(value1 => this.setArrayData(value1));
      (value['_embedded']?.operationses as Array<any>)?.forEach(value1 => this.setArrayData(value1));
      (value['_embedded']?.operationsHods as Array<any>)?.forEach(value1 => this.setArrayData(value1));
      this.source.load(this.dataArray);
    });
  }

  private setArrayData(data: any): void {
    if (!this.dataArray.includes(data)) { this.dataArray.push(data); }
  }


  private initialiseForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      kind: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

      fundAdministrator: [''],
      fundManagementDepartment: [''],
      operationsDepartment: [''],
      operationsHod: [''],
      fundManager: [''],
      userObject: [''],
    });
  }

  get form() { return this.userForm.controls; }

  ngOnInit(): void { this.initialiseForm(); }

  ngAfterViewInit() {
    this.departmentManagement.getDepartments('divisions').subscribe(res => {
      for (const value of res['_embedded']['divisions']) {
        this.divisions.push(value);
      }
    });
    this.departmentManagement.getDepartments('schemes').subscribe(res => {
      for (const value of res['_embedded']['schemes']) {
        this.schemes.push(value);
      }
    });
    this.departmentManagement.getDepartments('fundManagementDepartmentses').subscribe(res => {
      for (const value of res['_embedded']['fundManagementDepartmentses']) {
        this.fundManagementDepartmentsArray.push(value);
      }
    });

    this.departmentManagement.getDepartments('operationsDepartments').subscribe(res => {
      for (const value of res['_embedded']['operationsDepartments']) {
        this.operationsDepartmentsArray.push(value);
      }
    });

    this.loadManagers('OPERATIONS_HOD').loadManagers('FUND_MANAGER');

  }

  loadManagers(kind: string): UserManagementComponent {

    if ('FUND_MANAGER' === kind) {
      this.service.getUsers('fundManagers').subscribe(res => {
        this.fundManagersArray = null;
        this.fundManagersArray = new Array<any>();
        for (const value of res['_embedded']['fundManagers']) {
          this.fundManagersArray.push(value);
        }
      });
    } else {
      this.service.getUsers('operationsHods').subscribe(res => {
        this.operationsHODArray = null;
        this.operationsHODArray = new Array<any>();
        for (const value of res['_embedded']['operationsHods']) {
          this.operationsHODArray.push(value);
        }
      });
    }
    return this;
  }

  onEdit(event: any): void {
    if (event?.data) {
      this.label = 'Edit';
    }
    this.populateFields(event.data);
  }

  private populateFields(data: any): void {

    this.userForm.controls['name'].setValue(data['name']);
    this.userForm.controls['surname'].setValue(data['surname']);
    this.userForm.controls['kind'].setValue(data['kind']);
    this.userForm.controls['userObject'].setValue(data);
    this.userForm.controls['email'].setValue(data['email']);

  }

  formSubmit(form: FormGroup): void {
    console.log('<<<<<<<<< Submit >>>>>>>>>>>');
    console.log(form.value);

    const user = Object.entries(form.value).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {});
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;

    if (form.value?.userObject === null || form.value?.userObject.length === 0) {
      this.service.createUser(user, this.getApi(user['kind'])).subscribe(res => {
        this.toastrService.show(
          'User succesfully saved',
          `User has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading = false;
        this.source.prepend(res);
        this.onReset();
        this.loadManagers(user['kind']);
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if (form.value?.userObject?._links.self?.href) {
      this.service.updateUser(form.value?.userObject?._links.self?.href, user)
        .subscribe(res => {
          this.toastrService.show(
            'User succesfully saved',
            `User has been succesfully saved`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
            this.loading=false;
          this.source.remove(form.value?.userObject).then(value => this.source.prepend(res));
          this.onReset();
          this.loadManagers(user['kind']);
        }, error => {
          this.loading = false;
          this.handleError();
        });
    }

  }


  async deleteteUser(form: FormGroup) {
    this.loading = true;
    let result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete user',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
      this.service.deleteUser(form.value?.userObject?._links.self?.href)
        .subscribe(value_ => {
          this.toastrService.show(
            'User delete succesfully saved',
            `User has been delete succesfully`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.source.remove(form.value?.userObject).then(value => console.log(value));
          this.onReset();
          this.loadManagers(form.value?.kind);
        }, error => {
          this.loading = false;
          this.handleError();
        });
    }

  }

  selectedValue(event: any): void {

    this.isfundAdministrator = ('FUND_ADMINISTRATOR' === event.value.trim() ||
      'FUND_COORDINATOR' === event.value.trim() ||
      'FUND_INTERN' === event.value.trim());
    this.isOperationsUser = ('OPERATIONS' === event.value.trim());
    this.isOperationsUserHod = ('OPERATIONS_HOD' === event.value.trim());
    this.isfundManager = ('FUND_MANAGER' === event.value.trim());

  }

  private getApi(kind: string): string {
    const apis = new Map<string, string>();
    apis.set('FUND_MANAGER', 'fundManagers');
    apis.set('OPERATIONS_HOD', 'operationsHods');
    apis.set('OPERATIONS', 'operationses');
    apis.set('FUND_ADMINISTRATOR', 'fundAdministrators');
    apis.set('FUND_COORDINATOR', 'fundAdministrators');
    apis.set('FUND_INTERN', 'fundAdministrators');
    return apis.get(kind);
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
    this.resetFields();
    this.label = 'Add';
  }

  resetFields(): void {
    this.isfundAdministrator = false;
    this.isOperationsUser = false;
    this.isOperationsUserHod = false;
    this.isfundManager = false;
  }
  handleError() {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger' });
  }
}
