import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbGlobalPhysicalPosition, NbStepperComponent, NbToastrService } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DepartmentManagementService } from '../../../jbpm/service/department-management.service';
import { scheme_management_table_settings } from './scheme-utils';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'ngx-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchemeComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();
  dataArray: Array<any> = new Array<any>();
  settings = scheme_management_table_settings;

  schemeForm: FormGroup;

  readonly api: string  = 'schemes';
  label: string = 'Add';
  submitted= false;
  loading=false;


  constructor(private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
              protected http: HttpClient, private service: DepartmentManagementService) {
      this.loadData();
  }


  loadData(): void {
    this.service.getDepartments(this.api).subscribe(value => {
      for (const index of value['_embedded'][`${this.api}`]) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });
  }


  ngOnInit(): void {
     this.initialiseForms();
  }

  private initialiseForms(): void {

    this.schemeForm = this.formBuilder.group({
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
      this.schemeForm.controls['name'].setValue(data['name']);
      this.schemeForm.controls['description'].setValue(data['description']);
      this.schemeForm.controls['departmentObject'].setValue(data);
  }


  departmentformSubmit(form: FormGroup): void {
    this.submitted = true;
    if (this.schemeForm.invalid) {
      return;
    }
    this.loading = true;
    const  departmentBody: {[ k: string]: any} = {
      name  : form.value.name,
      description : form.value.description,
    };

    if (form.value?.departmentObject === null || form.value?.departmentObject.length === 0) {
      this.service.addDepartment(departmentBody, this.api).subscribe( res => {
        this.toastrService.show(
          'Scheme succesfully saved',
          `Scheme has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading=false;
        this.source.prepend(res);
        this.onReset();
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if ( form.value?.departmentObject?._links.self?.href) {

      this.service.updateDepartment(form.value?.departmentObject?._links.self?.href, departmentBody )
        .subscribe( res => {
          this.toastrService.show(
            'Scheme succesfully saved',
            `Scheme has been succesfully saved`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
            this.loading=false;
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
    let result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Scheme Divisions',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
    this.service.deleteDepartment( form.value?.departmentObject?._links.self?.href)
      .subscribe(value_ => {
        this.toastrService.show(
          'Scheme removed',
          `Scheme has been remove`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading=false;
        this.source.remove(form.value?.departmentObject).then(value => console.error(value) );
        this.onReset();
      });
    }else{
      this.loading=false;
    }
  }

  onReset() {
    this.label = 'Add';
    this.submitted=false;
    this.schemeForm.reset();
  }
  get form() { return this.schemeForm.controls; }
  handleError() {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger' });
  }
}
