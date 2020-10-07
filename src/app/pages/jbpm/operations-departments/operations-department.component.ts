import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';
import { DepartmentManagementService } from '../../../jbpm/service/department-management.service';

@Component({
  selector: 'ngx-operations',
  templateUrl: './operations-department.component.html',
  styleUrls: ['./operations-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OperationsDepartmentComponent implements OnInit { // extends  CommonConfigsComponent implements OnInit {


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

  readonly root: string = 'operationsDepartments';
  label: string = 'Add';

  source: LocalDataSource = new LocalDataSource();
  dataArray: Array<any> = new Array<any>();
  settings = this.department_management_table_settings;
  departmentForm: FormGroup;

  listKinds: Array<string> = new Array<any>();

  submitted = false;
  loading = false;

  constructor(
    // protected ref: NbDialogRef<CommonConfigsComponent>,
    protected dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private http: HttpClient, private service: DepartmentManagementService) {
    // super(dialogService, ref);
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
        if (value?.doc?.value) { this.listKinds = value?.doc?.value.split(','); }
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
    this.departmentForm.controls['department'].setValue(data['kind']);
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
          'Operations succesfully saved',
          `Operations has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
        this.loading = false;
        this.source.prepend(res);
        this.onReset();
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if (form.value?.departmentObject?._links.self?.href) {
      this.service.updateDepartment(form.value?.departmentObject?._links.self?.href, departmentBody)
        .subscribe(res => {
          this.toastrService.show(
            'Operations succesfully saved',
            `Operations has been succesfully saved`,
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

    // super.dialogMessageBody = 'Are you sure you want to delete';

    //  this.openDialog('').subscribe(value => {
    this.loading = true;
    const result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete Operations',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
      this.service.deleteDepartment(form.value?.departmentObject?._links.self?.href)
        .subscribe(value_ => {
          this.toastrService.show(
            'Operations removed',
            `Operations has been remove`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading = false;
          this.source.remove(form.value?.departmentObject).then(value => console.error(value));
          this.onReset();
        });
    } else {
      this.loading = false;
    }
    // });
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
