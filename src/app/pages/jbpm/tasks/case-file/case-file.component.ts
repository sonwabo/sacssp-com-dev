import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CaseService } from '../../../../jbpm/service/case.service';


@Component({
  selector: 'ngx-case-file',
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})

export class CaseFileComponent implements OnInit {
  @Input() case: any;
  caseForm: FormGroup;
  fundManagementUsers: string[] = ['fund-administrator', 'fund-manager'];
  fundManagementManagers: string[] = ['fund-manager'];
  origins: string[] = ['Engagement', 'Telecon', 'Email from Scheme'];
  serviceProviderNetworks: any[] = [{ value: 'GEMS', description: 'Government Employee Medical Scheme' }];
  divisions: any[] = [{ value: 'MHRS', description: 'Medscheme Health Risk Solutions' }, { value: 'DENIS', description: 'Dental Management Services' }]
  priorities: any[] = [
    {value: 0, description: 'High'},
    {value: 1, description: ''},
    {value: 2, description: ''},
    {value: 3, description: ''},
    {value: 4, description: ''},
    {value: 5, description: 'Medium'},
    {value: 6, description: ''},
    {value: 7, description: ''},
    {value: 8, description: ''},
    {value: 9, description: ''},
    {value: 10, description: 'Low'}

];

  constructor(
    protected caseService: CaseService,
    protected router: Router,
    protected http: HttpClient) {

  }
  ngOnInit(): void {
    this.caseForm = new FormGroup({
      receivedDate: new FormControl('', Validators.required),
      origin: new FormControl('', Validators.required),
      receivedFrom: new FormControl('', [Validators.required, Validators.email]),
      division: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      receiptAcknowledgementDate: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      assignedTo: new FormControl('', Validators.email),
      manager: new FormControl('', Validators.email),
      serviceProviderNetwork: new FormControl('', Validators.required),
      assignedDate: new FormControl('', Validators.required),
      progress: new FormControl('', Validators.required),
      submissionDate: new FormControl('', Validators.required),
      fmAllocated: new FormControl('', Validators.required),
    });

    this.caseService.getCaseModel(this.case['container-id'], this.case['case-id']).subscribe(
      data => {
        let model = data['io.jumpco.metropolitan.requesttracker.Demand'];
        this.caseForm.controls['receivedFrom'].setValue(model.clientEmail);
        this.caseForm.controls['subject'].setValue(model.subject);
        this.caseForm.controls['description'].setValue(model.demand);
        this.caseForm.controls['origin'].setValue(model.origin);
        this.caseForm.controls['serviceProviderNetwork'].setValue(model.spn);
        this.caseForm.controls['division'].setValue(model.division);
        this.caseForm.controls['receiptAcknowledgementDate'].setValue(model.acknowledgementDate['java.util.Date']);
        this.caseForm.controls['dueDate'].setValue(this.case['case-sla-due-date']);

      }
    )
  }
}
