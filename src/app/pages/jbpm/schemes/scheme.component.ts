import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DivisionManagementService } from '../../../jbpm/service/division-management.service';
import { scheme_management_table_settings } from './scheme-utils';

@Component({
  selector: 'ngx-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchemeComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  sourceScheme: LocalDataSource = new LocalDataSource();
  dataArraySchemes: Array<any> = new Array<any>();
  settings = scheme_management_table_settings;
  settingsScheme = scheme_management_table_settings;

  schemeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              protected http: HttpClient, private service: DivisionManagementService) {

    this.service.getSchemes().subscribe(value => {
      for (const index of value['_embedded']['schemes']) { this.dataArraySchemes.push(index); }
      this.sourceScheme.load(this.dataArraySchemes);
    });

  }
  ngOnInit(): void {
     this.initialiseForms();
  }

  private initialiseForms(): void {

    this.schemeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]});
  }

  onEdit(event: any): void {
    console.error(event);
    this.populateFields(event.data );
  }

  private populateFields(data: any): void {
      this.schemeForm.controls['name'].setValue(data['name']);
      this.schemeForm.controls['description'].setValue(data['description']);
  }

  formSubmit(form: FormGroup): void {

  }

  schemeformSubmit(form: FormGroup): void {

  }
  onReset() {
      this.schemeForm.reset();
  }

}
