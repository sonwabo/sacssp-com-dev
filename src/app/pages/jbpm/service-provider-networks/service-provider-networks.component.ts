import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {spn_management_table_settings} from './spn-utils';

import {
  ServceProviderNetworksService} from '@app/pages/jbpm/service-provider-networks/servce-provider-networks.service';

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

  readonly root: string = 'serviceProviderNetworks';
  label: string = 'Add';


  constructor(private formBuilder: FormBuilder,
              protected http: HttpClient, private service: ServceProviderNetworksService) {
    this.loadData();
  }

  loadData(): void {

    this.service.getServiceProviderNetworks().subscribe(value => {
      for (const index of value['_embedded'][`${this.root}`]) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });
  }

  ngOnInit(): void {
     this.initialiseForms();
  }

  private initialiseForms(): void {
    this.spnForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      spnObject: ['']});
  }

  onEdit(event: any): void {
    if (event?.data) {
        this.label = 'Update';
    }
    this.populateFields(event.data );
  }

  private populateFields(data: any): void {
      this.spnForm.controls['name'].setValue(data['name']);
      this.spnForm.controls['description'].setValue(data['description']);
      this.spnForm.controls['spnObject'].setValue(data);
  }

  formSubmit(form: FormGroup): void {
    const  spnBody: {[ k: string]: any} = {
      name  : form.value.name,
      description : form.value.description,
    };

    if (form.value?.spnObject === null || form.value?.spnObject.length === 0) {
      this.service.addServiceProviderNetworks(spnBody).subscribe( res => {
        this.source.prepend(res);
        this.onReset();
      });

    } else if ( form.value?.spnObject?._links.self?.href) {
      console.error(form.value?.spnObject?._links.self?.href.replace());
      this.service.updateServiceProviderNetworks(form.value?.spnObject?._links.self?.href, spnBody )
        .subscribe( res => {
          this.source.remove(form.value?.spnObject).then(value => this.source.prepend(res));
          this.onReset();
        });
    }
  }

  deleteSpn(form: FormGroup): void {

    this.service.deleteServiceProviderNetworks( form.value?.spnObject?._links.self?.href)
      .subscribe(value_ => {
        this.source.remove(form.value?.spnObject).then(value => console.error(value) );
        this.onReset();
      });

  }
  onReset() {
      this.label = 'Add';
      this.spnForm.reset();
  }

}
