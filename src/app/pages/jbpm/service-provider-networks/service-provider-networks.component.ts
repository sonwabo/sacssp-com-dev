import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DivisionManagementService } from '../../../jbpm/service/division-management.service';
import {spn_management_table_settings} from './spn-utils';

@Component({
  selector: 'ngx-spn',
  templateUrl: './service-provider-networks.component.html',
  styleUrls: ['./service-provider-networks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceProviderNetworksComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();

  dataArray: Array<any> = new Array<any>();

  readonly settings = spn_management_table_settings;

  spnForm: FormGroup;

  label: string = 'Add';


  constructor(private formBuilder: FormBuilder,
              protected http: HttpClient, private service: DivisionManagementService) {
    this.service.getServiceProviderNetworks().subscribe(value => {
      for (const index of value['_embedded']['serviceProviderNetworks']) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });

  }
  ngOnInit(): void {
     this.initialiseForms();
  }

  private initialiseForms(): void {
    this.spnForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required] });
  }
 // service-provider-networks
  onEdit(event: any): void {
    console.error(event);
    if(event?.data) {
        this.label = 'Edit';
    }
    this.populateFields(event.data );
  }

  private populateFields(data: any): void {
      this.spnForm.controls['name'].setValue(data['name']);
      this.spnForm.controls['description'].setValue(data['description']);
  }

  formSubmit(form: FormGroup): void {

  }

  schemeformSubmit(form: FormGroup): void {

  }
  onReset() {
      this.label = 'Add';
      this.spnForm.reset();
  }

}
