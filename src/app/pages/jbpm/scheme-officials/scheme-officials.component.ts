import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NbStepperComponent} from '@nebular/theme';
import {users_management_table_settings} from '../users/user-utils';
import {LocalDataSource} from 'ng2-smart-table';
import {HttpClient} from '@angular/common/http';
import {UserManagementService} from '../../../jbpm/service/user-management.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DepartmentManagementService} from '@app/jbpm/service/department-management.service';

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


  selectedDivision: string;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
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
          this.dataArray.push(obj);
          this.source.refresh();
        });
      }

    });
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  private initialiseForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      fundAdministrator: ['', Validators.required],
      division: ['', Validators.required],
      scheme: ['', Validators.required],
      userObject: [''],
    });
  }

  onEdit(event: any): void {
    if (event?.data) {
      this.label = 'Update';
    }
    this.populateFields(event.data);
  }

  private populateFields(data: any): void {
    this.userForm.controls['name'].setValue(data['name']);
    this.userForm.controls['surname'].setValue(data['surname']);
    this.userForm.controls['userObject'].setValue(data);
    this.userForm.controls['email'].setValue(data['email']);

    // this.userForm.controls['fundAdministrator'].setValue(data['kind']);
    // this.userForm.controls['division'].setValue(data['kind']);
    // this.userForm.controls['scheme'].setValue(data);
  }

  formSubmit(form: FormGroup): void {

    if (form.value.name.length === 0 ) {
      return;
    }

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
        this.setUpdateData(res);
      });

    } else if (form.value?.userObject?._links.self?.href) {
      this.service.updateUser(form.value?.userObject?._links.self?.href, userBody)
        .subscribe(res => {
          console.log(res);
          this.source.remove(form.value?.userObject).then(value => this.source.prepend(res));
          this.setUpdateData(res);
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


  deleteUser(form: FormGroup): void {

    this.service.deleteUser(form.value?.userObject?._links.self?.href)
      .subscribe(value_ => {
        this.source.remove(form.value?.userObject).then(value => console.error(value));
        this.onReset();
      });
  }

  onReset() {
    this.label = 'Add';
    this.userForm.reset();
  }

  ngAfterViewInit(): void {
    this.source.load(this.dataArray);
    this.source.refresh();
  }

}
