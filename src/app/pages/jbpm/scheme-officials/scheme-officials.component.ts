import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbGlobalPhysicalPosition, NbStepperComponent, NbToastrService } from '@nebular/theme';
import { users_management_table_settings } from '../users/user-utils';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { UserManagementService } from '../../../jbpm/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentManagementService } from '@app/jbpm/service/department-management.service';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'ngx-scheme-official',
  templateUrl: './scheme-officials.component.html',
  styleUrls: ['./scheme-officials.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchemeOfficialsComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();
  dataArray: Array<any> = new Array<any>();
  settings = users_management_table_settings;

  divisionsArray: Array<any> = new Array<any>();
  schemesArray: Array<any> = new Array<any>();
  fundAdministratorsArray: Array<any> = new Array<any>();


  userForm: FormGroup;

  readonly kind: string = 'SCHEME_OFFICIAL';
  readonly root: string = 'schemeOfficials';
  label: string = 'Add';
  submitted = false;
  loading = false;

  selectedDivision: string;

  constructor(private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private service: UserManagementService,
    private departmentManagement: DepartmentManagementService,
  ) {
    this.loadData();
  }

  loadData(): void {

    this.loadUser();

    this.departmentManagement.getDepartments('schemes').subscribe(res => {
      (res['_embedded']?.schemes as Array<any>)?.forEach(val => this.schemesArray.push(val));
    });

    this.departmentManagement.getDepartments('divisions').subscribe(res => {
      (res['_embedded']?.divisions as Array<any>)?.forEach(val => this.divisionsArray.push(val));
    });

    this.service.getUsers('fundAdministrators').subscribe(res => {
      (res['_embedded']?.fundAdministrators as Array<any>)?.forEach(val => this.fundAdministratorsArray.push(val));
    });
  }

  loadUser(): void {

    this.dataArray = new Array<any>();

    this.service.getUsers(this.root).subscribe(res => {
      for (const value of res['_embedded'][`${this.root}`]) {
        const obj: { [k: string]: any } = value;
        this.departmentManagement.getDepartment(value?._links?.division?.href).subscribe(res_ => {
          obj.division = res_?.name;
          this.source.refresh();
        });
        this.service.getUser(value._links.fundAdministrator.href).subscribe(res_ => {
          obj.linkedFundAdmin = `${res_.name} ${res_.surname} , ${res_.kind} `;
          this.source.refresh();

        });
        this.dataArray.push(obj);
        this.source.refresh();
      }
    });
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  private initialiseForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      fundAdministrator: ['', [Validators.required]],
      division: ['', [Validators.required]],
      scheme: ['', [Validators.required]],
      userObject: [''],
    });
  }

  onEdit(event: any): void {
    if (event?.data) {
      this.label = 'Update';
    }
    this.populateFields(event.data);
  }
  get form() { return this.userForm.controls; }
  private populateFields(data: any): void {

    console.log('<<<<<<<<<  data >>>>>>>>>>> ');
    console.log(data);
    this.userForm.controls['name'].setValue(data['name']);
    this.userForm.controls['surname'].setValue(data['surname']);
    this.userForm.controls['userObject'].setValue(data);
    this.userForm.controls['email'].setValue(data['email']);

    this.userForm.controls['fundAdministrator'].setValue(data['linkedFundAdmin']);
    this.userForm.controls['division'].setValue(data['division']);
    this.userForm.controls['scheme'].setValue(data);
  }

  formSubmit(form: FormGroup): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    if (form.value.name.length === 0) {
      return;
    }
    this.loading = true;
    const userBody: { [k: string]: any } = {
      name: form.value.name,
      surname: form.value.surname,
      email: form.value.email,
      kind: this.kind,
      fundAdministrator: form.value.fundAdministrator,
      scheme: form.value.scheme,
      division: form.value.division,
    };


    if (form.value?.userObject === null || form.value?.userObject.length === 0) {

      this.service.createUser(userBody, this.root).subscribe(res => {
        this.toastrService.show(
          'Scheme Officials succesfully saved',
          `Scheme Officials has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
        this.setUpdateData(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if (form.value?.userObject?._links.self?.href) {
      this.service.updateUser(form.value?.userObject?._links.self?.href, userBody)
        .subscribe(res => {
          this.toastrService.show(
            'Scheme Officials succesfully saved',
            `Scheme Officials has been succesfully saved`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.source.remove(form.value?.userObject).then(value => this.source.prepend(res));
          this.setUpdateData(res);
          this.loading = false;
        }, error => {
          this.loading = false;
          this.handleError();
        });
    }
  }

  setUpdateData(res): void {
    const resBody: { [k: string]: any } = res;
    resBody.division = this.selectedDivision;
    this.source.prepend(resBody);
    this.onReset();
  }

  private selectedValue(value: any): void {
    this.selectedDivision = value.name;
  }


  async deleteUser(form: FormGroup) {
    this.loading = true;
    let result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete Scheme Officials',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
      this.service.deleteUser(form.value?.userObject?._links.self?.href)
        .subscribe(value_ => {
          this.toastrService.show(
            'Scheme Officials removed',
            `Scheme Officials has been remove`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
            this.loading=false;
          this.source.remove(form.value?.userObject).then(value => console.error(value));
          this.onReset();
        }, error => {
          this.loading = false;
          this.handleError();
        }

        );
    }
    this.loading = false;
  }
  handleError() {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger' });
  }
  onReset() {
    this.label = 'Add';
    this.submitted = false;
    this.userForm.reset();
  }

  ngAfterViewInit(): void {
    this.source.load(this.dataArray);
    this.source.refresh();
  }

}
