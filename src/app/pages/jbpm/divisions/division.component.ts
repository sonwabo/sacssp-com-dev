import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbGlobalPhysicalPosition, NbStepperComponent, NbToastrService } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DepartmentManagementService } from '../../../jbpm/service/department-management.service';
import {division_management_table_settings} from './divisions-utils';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'ngx-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DivisionComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();

  dataArray: Array<any> = new Array<any>();

  settings = division_management_table_settings;

  departmentForm: FormGroup;

  readonly root: string = 'divisions';
  label: string = 'Add';
  submitted = false;
  loading =false;

  constructor(private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
              protected http: HttpClient, private service: DepartmentManagementService) {
    this.loadData();
  }

  loadData(): void {

    this.service.getDepartments(this.root).subscribe(value => {
      for (const index of value['_embedded'][`${this.root}`]) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });

  }

  ngOnInit(): void {
     this.initialiseForms();
  }

  private initialiseForms(): void {

    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      departmentObject: ['']});
  }

  onEdit(event: any): void {
    if (event?.data) {
      this.label = 'Update';
    }
    this.populateFields(event.data );
  }

  private populateFields(data: any): void {
    this.departmentForm.controls['name'].setValue(data['name']);
    this.departmentForm.controls['description'].setValue(data['description']);
    this.departmentForm.controls['departmentObject'].setValue(data);
  }

  departmentformSubmit(form: FormGroup): void {
    this.submitted = true;
    if (this.departmentForm.invalid) {
      return;
    }
    const  departmentBody: {[ k: string]: any} = {
      name  : form.value.name,
      description : form.value.description,
    };
    this.loading = true;
    if (form.value?.departmentObject === null || form.value?.departmentObject.length === 0) {
      this.service.addDepartment(departmentBody, this.root).subscribe( res => {
        this.toastrService.show(
          'Divisions succesfully saved',
          `Divisions has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading =false;
        this.source.prepend(res);
        this.onReset();
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if ( form.value?.departmentObject?._links.self?.href) {
      console.error(form.value?.departmentObject?._links.self?.href.replace());
      this.service.updateDepartment(form.value?.departmentObject?._links.self?.href, departmentBody )
        .subscribe( res => {
          this.toastrService.show(
            'Divisions succesfully saved',
            `Divisions has been succesfully saved`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
            this.loading =false;
          this.source.remove(form.value?.departmentObject).then(value => this.source.prepend(res));
          this.onReset();
        }, error => {
          this.loading = false;
          this.handleError();
        });
    }
  }

  async deleteDepartment(form: FormGroup) {
    this.loading = true;
    const result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete Divisions',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
    this.service.deleteDepartment( form.value?.departmentObject?._links.self?.href)
      .subscribe(value_ => {
        this.toastrService.show(
          'Divisions removed',
          `Divisions has been remove`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading =false;
        this.source.remove(form.value?.departmentObject).then(value => console.error(value) );
        this.onReset();
      });
    }else{
      this.loading =false;
    }

  }

  onReset() {
    this.label = 'Add';
    this.submitted=false;
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
