import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbGlobalPhysicalPosition, NbStepperComponent, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { spn_management_table_settings } from './spn-utils';
import { ServceProviderNetworksService } from './servce-provider-networks.service';
import { ConfirmDialogComponent } from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';


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
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    protected http: HttpClient, private service: ServceProviderNetworksService) {
    this.loadData();
  }

  loadData(): void {

    this.service.getServiceProviderNetworks().subscribe(value => {
      for (const index of value['_embedded'][`${this.root}`]) { this.dataArray.push(index); }
      this.source.load(this.dataArray);
    });
  }
  submitted = false;
  loading = false;

  ngOnInit(): void {
    this.initialiseForms();
  }

  private initialiseForms(): void {
    this.spnForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      spnObject: ['']
    });
  }

  onEdit(event: any): void {
    if (event?.data) {
      this.label = 'Update';
    }
    this.populateFields(event.data);
  }

  private populateFields(data: any): void {
    this.spnForm.controls['name'].setValue(data['name']);
    this.spnForm.controls['description'].setValue(data['description']);
    this.spnForm.controls['spnObject'].setValue(data);
  }

  formSubmit(form: FormGroup): void {
    this.submitted = true;
    if (this.spnForm.invalid) {
      return;
    }
    const spnBody: { [k: string]: any } = {
      name: form.value.name,
      description: form.value.description,
    };
    this.loading = true;
    if (form.value?.spnObject === null || form.value?.spnObject.length === 0) {
      this.service.addServiceProviderNetworks(spnBody).subscribe(res => {
        this.toastrService.show(
          'Service Provider Network succesfully saved',
          `Service Provider Network has been succesfully saved`,
          { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
        this.loading = false;
        this.source.prepend(res);
        this.onReset();
      }, error => {
        this.loading = false;
        this.handleError();
      });

    } else if (form.value?.spnObject?._links.self?.href) {
      console.error(form.value?.spnObject?._links.self?.href.replace());
      this.service.updateServiceProviderNetworks(form.value?.spnObject?._links.self?.href, spnBody)
        .subscribe(res => {
          this.toastrService.show(
            'Service Provider Network succesfully saved',
            `Service Provider Network has been succesfully saved`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading = false;
          this.source.remove(form.value?.spnObject).then(value => this.source.prepend(res));
          this.onReset();
        }, error => {
          this.loading = false;
          this.handleError();
        });
    }
  }

  async deleteSpn(form: FormGroup): Promise<void> {
    this.loading = true;
    const result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete Service Provider Network',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();
    if (result) {
      this.service.deleteServiceProviderNetworks(form.value?.spnObject?._links.self?.href)
        .subscribe(value_ => {
          this.toastrService.show(
            'Service Provider Network removed',
            `Service Provider Network has been remove`,
            { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
          this.loading = false;
          this.source.remove(form.value?.spnObject).then(value => console.error(value));
          this.onReset();
        });
    } else {
      this.loading = false;
    }

  }
  onReset() {
    this.label = 'Add';
    this.submitted = false;
    this.spnForm.reset();
  }
  get form() { return this.spnForm.controls; }
  handleError() {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger' });
  }
}
