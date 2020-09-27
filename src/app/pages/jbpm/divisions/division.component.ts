import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DepartmentManagementService } from '../../../jbpm/service/department-management.service';
import {division_management_table_settings} from './divisions-utils';

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

  constructor(private formBuilder: FormBuilder,
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

    const  departmentBody: {[ k: string]: any} = {
      name  : form.value.name,
      description : form.value.description,
    };

    if (form.value?.departmentObject === null || form.value?.departmentObject.length === 0) {
      this.service.addDepartment(departmentBody, this.root).subscribe( res => {
        this.source.prepend(res);
        this.onReset();
      });

    } else if ( form.value?.departmentObject?._links.self?.href) {
      console.error(form.value?.departmentObject?._links.self?.href.replace());
      this.service.updateDepartment(form.value?.departmentObject?._links.self?.href, departmentBody )
        .subscribe( res => {
          this.source.remove(form.value?.departmentObject).then(value => this.source.prepend(res));
          this.onReset();
        });
    }
  }

  deleteDepartment(form: FormGroup): void {
    this.service.deleteDepartment( form.value?.departmentObject?._links.self?.href)
      .subscribe(value_ => {
        this.source.remove(form.value?.departmentObject).then(value => console.error(value) );
        this.onReset();
      });
  }

  onReset() {
    this.label = 'Add';
    this.departmentForm.reset();
  }

}
