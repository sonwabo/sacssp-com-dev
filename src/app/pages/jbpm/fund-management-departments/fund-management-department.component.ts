import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DepartmentManagementService} from '@app/jbpm/service/department-management.service';


@Component({
  selector: 'ngx-fund-management-department',
  templateUrl: './fund-management-department.component.html',
  styleUrls: ['./fund-management-department.component.scss'],
})

export class FundManagementDepartmentComponent implements OnInit {


  readonly department_management_table_settings: any =  {
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


  constructor(
    private formBuilder: FormBuilder,
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
    this.service.getSchema(this.root).subscribe( res => {
      for (const value of res['alps']['descriptor'][0]['descriptor']) {
        if (value?.doc?.value) {
          this.listKinds = (value?.doc?.value.split(',') as Array<string>)
            .filter(val => (val.trim() === 'CLIENT_INTERFACE' || val.trim() === 'CLIENT_REPORTING' ));
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
    this.departmentForm.controls['department'].setValue(data['kind'].trim());
    this.departmentForm.controls['departmentObject'].setValue(data);
  }


  departmentformSubmit(form: FormGroup): void {

    const  departmentBody: {[ k: string]: any} = {
      name  : form.value.name,
      kind : form.value.department.trim(),
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
