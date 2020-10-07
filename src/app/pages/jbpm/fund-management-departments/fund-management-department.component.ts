import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';
import { DepartmentManagementService } from '../../../jbpm/service/department-management.service';


@Component({
  selector: 'ngx-fund-management-department',
  templateUrl: './fund-management-department.component.html',
  styleUrls: ['./fund-management-department.component.scss'],
})

export class FundManagementDepartmentComponent implements OnInit {


  readonly department_management_table_settings: any = {
    mode: 'external',
    actions: {
      add: false,
      edit: true,
      delete: false,
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      confirmCreate: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      name: {
        title: 'Department Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
    },
  };

  label: string = 'Add';
  readonly root: string = 'fundManagementDepartmentses';



  source: LocalDataSource = new LocalDataSource();
  dataArray: Array<any> = new Array<any>();
  settings = this.department_management_table_settings;
  departmentForm: FormGroup;

  listKinds: Array<string> = new Array<any>();

  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    protected router: Router,
    protected http: HttpClient, private service: DepartmentManagementService) {

    this.loadData();
  }

  loadData(): void {

    this.service.getDepartments(this.root).subscribe(value => {
      for (const index of value['_embedded'][`${this.root}`]) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });

    // This is to load the Enum values
    this.service.getSchema(this.root).subscribe(res => {
      for (const value of res['alps']['descriptor'][0]['descriptor']) {
        if (value?.doc?.value) {
          this.listKinds = (value?.doc?.value.split(',') as Array<string>)
            .filter(val => (val.trim() === 'CLIENT_INTERFACE' || val.trim() === 'CLIENT_REPORTING'));
        }
      }
    });
  }


  ngOnInit(): void {
    this.initialiseForms();
  }

  private initialiseForms(): void {

    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      description: ['', Validators.required],
      departmentObject: ['']
    });
  }

  onEdit(event: any): void {
    if (event?.data) {
      this.label = 'Update';
    }
    this.populateFields(event.data);
  }

  private populateFields(data: any): void {
    this.departmentForm.controls['name'].setValue(data['name']);
    this.departmentForm.controls['description'].setValue(data['description']);
    this.departmentForm.controls['department'].setValue(data['kind'].trim());
    this.departmentForm.controls['departmentObject'].setValue(data);
  }


  departmentformSubmit(form: FormGroup): void {
    this.submitted = true;
    if (this.departmentForm.invalid) {
      return;
    }
    const departmentBody: { [k: string]: any } = {
      name: form.value.name,
      kind: form.value.department.trim(),
      description: form.value.description,
    };
    this.loading = true;
    if (form.value?.departmentObject === null || form.value?.departmentObject.length === 0) {
      this.service.addDepartment(departmentBody, this.root).subscribe(res => {
        this.toastrService.show(
          'Fund management departments succesfully saved',
          `Fund management departments has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
        this.loading = false;
        this.source.prepend(res);
        this.onReset();
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if (form.value?.departmentObject?._links.self?.href) {
      console.error(form.value?.departmentObject?._links.self?.href.replace());
      this.service.updateDepartment(form.value?.departmentObject?._links.self?.href, departmentBody)
        .subscribe(res => {
          this.toastrService.show(
            'Fund management departments succesfully saved',
            `Fund management departments has been succesfully saved`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading = false;
          this.source.remove(form.value?.departmentObject).then(value => this.source.prepend(res));
          this.onReset();
        }, error => {
          this.loading = false;
          this.handleError();
        });
    }
  }

  async deleteDepartment(form: FormGroup): Promise<void> {
    this.loading = true;
    const result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete Fund management departments',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
      this.service.deleteDepartment(form.value?.departmentObject?._links.self?.href)
        .subscribe(value_ => {
          this.toastrService.show(
            'Fund management departments removed',
            `Fund management departments has been remove`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading = false;
          this.source.remove(form.value?.departmentObject).then(value => console.error(value));
          this.onReset();
        });
    } else {
      this.loading = false;
    }
  }

  onReset() {
    this.label = 'Add';
    this.submitted = false;
    this.departmentForm.reset();
  }
  get form() { return this.departmentForm.controls; }
  handleError() {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger' });
  }
}
