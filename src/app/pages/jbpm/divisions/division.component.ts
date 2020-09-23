import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DivisionManagementService } from '../../../jbpm/service/division-management.service';
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

  divisionForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
              protected http: HttpClient, private service: DivisionManagementService) {
    this.service.getDivisions().subscribe(value => {
      for (const index of value['_embedded']['divisions']) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });

  }
  ngOnInit(): void {
     this.initialiseForms();
  }

  private initialiseForms(): void {
    this.divisionForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required] });
  }

  onEdit(event: any): void {
    console.error(event);
    this.populateFields(event.data );
  }

  private populateFields(data: any): void {
      this.divisionForm.controls['name'].setValue(data['name']);
      this.divisionForm.controls['description'].setValue(data['description']);
  }

  formSubmit(form: FormGroup): void {

  }

  schemeformSubmit(form: FormGroup): void {

  }
  onReset() {
      this.divisionForm.reset();
  }

}
