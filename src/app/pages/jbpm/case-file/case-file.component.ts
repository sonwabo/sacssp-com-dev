import {Demand, Status, TaskInputs} from './../../../jbpm/domain/demand';
import { environment } from './../../../../environments/environment';
import { ProcessService } from './../../../jbpm/service/process.service';
import { TaskService } from './../../../jbpm/service/task.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CaseService } from '../../../jbpm/service/case.service';
import {Observable} from "rxjs";
import {APP_ROUTES} from "../utils/routes-list-enum";
import {async} from "rxjs-compat/scheduler/async";




@Component({
  selector: 'ngx-case-file',
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})

export class CaseFileComponent implements OnInit {
  @Input() case: any;
  @Input() taskName: string = '';
  @Input() taskSummary?: any;
  caseForm: FormGroup;
  fundManagementUsers: string[] = ['fund-administrator', 'fund-manager'];
  fundManagementManagers: string[] = ['fund-manager'];
  origins: string[] = ['Engagement', 'Telecon', 'Email from Scheme'];
  serviceProviderNetworks: any[] = [{ value: 'GEMS', description: 'Government Employee Medical Scheme' }];
  divisions: any[] = [{ value: 'MHRS', description: 'Medscheme Health Risk Solutions' }, { value: 'DENIS', description: 'Dental Management Services' }];
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
    {value: 10, description: 'Low'}];

  activeTaskInstance: any;
  sendToOperations: boolean = false;
  taskCompleted: boolean = true;

  constructor(
    protected caseService: CaseService,
    protected taskService: TaskService,
    protected processService: ProcessService,
    protected router: Router,
    protected http: HttpClient) {

  }
  ngOnInit(): void {

    this.caseForm = new FormGroup({
      receivedDate: new FormControl({value: '', disabled: true }, [Validators.required]),
      origin: new FormControl('', Validators.required),
      receivedFrom: new FormControl('', [Validators.required, Validators.email]),
      division: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      receiptAcknowledgementDate: new FormControl('', Validators.required),
      dueDate: new FormControl({value: '', disabled: true }, Validators.required),
      status: new FormControl('', Validators.required),
      assignedTo: new FormControl('', Validators.email),
      manager: new FormControl('', Validators.email),
      serviceProviderNetwork: new FormControl('', Validators.required),
      assignedDate: new FormControl('', Validators.required),
      progress: new FormControl('', Validators.required),
      submissionDate: new FormControl('', Validators.required),
      fmAllocated: new FormControl('', Validators.required),
      operations: new FormControl('', Validators.required),

    });


    this.caseService.getCaseModel(this.case['container-id'], this.case['case-id']).subscribe(
      data => {
        // <label class="label" for="input-operations">Send to Operations<nb-icon icon="question-mark-circle"  nbTooltip="Send Operations a message to review" nbTooltipStatus="primary" status="info"></nb-icon></label>
        // <nb-checkbox (checkedChange)="sendToOperationsCheck($event)"  id="input-operations"></nb-checkbox>
        // <textarea  *ngIf="sendToOperations" nbInput fullWidth type="text" formControlName="operations" id="input-operations-text"></textarea><br/>
        console.error('======  Promise sss ==========');

        console.error(data);

        this.caseForm.controls['dueDate'].setValue(this.case['case-sla-due-date']);
        this.caseForm.controls['receivedDate'].setValue(this.case['case-started-at']);

        if ( data === null || data === undefined) { return; }

        this.caseForm.controls['receivedFrom'].setValue(data.clientEmail);
        this.caseForm.controls['subject'].setValue(data.subject);
        this.caseForm.controls['description'].setValue(data.demand);
        this.caseForm.controls['origin'].setValue(data.origin);
        this.caseForm.controls['serviceProviderNetwork'].setValue(data.spn);
        this.caseForm.controls['division'].setValue(data.division);
        this.caseForm.controls['receiptAcknowledgementDate'].setValue(data.acknowledgementDate['java.util.Date']);
      });
  }

  formSubmit(userProfileForm: FormGroup) {

    const formdata = userProfileForm.value;
    const containerId = this.taskSummary['task-container-id'];
    const taskId = this.taskSummary['task-id'];
    const taskStatus = this.taskSummary['task-status'];

    if (  taskStatus === Status.READY) {
         this.taskService.claimTask(containerId, taskId);
         this.taskService.startClaimedTask(containerId, taskId);
    } else if (taskStatus === Status.COMPLETED) { return;  }

    this.taskService.getTaskInformation(containerId, taskId).subscribe(taskRes => {

        const input: TaskInputs = this.mapper(formdata, taskRes['task-status']);
        console.error( input );

        this.taskService.completeClaimedTask(containerId, taskId, input).subscribe(res => {
          alert('Task Completed Successfullty');
          this.router.navigate(['pages/jbpm/cases-table'], {replaceUrl: true});
        }, error => {
            console.error('========= Task Complete Error ===========');
            console.error(error );
        });
    });
  }

  sendToOperationsCheck(event: any): void {
    this.sendToOperations = event;
  }

  private mapper(formData: any, taskStatus: string, operations?: string): TaskInputs {

    console.error( formData );

     const demand = new Demand(
        formData.receiptAcknowledgementDate,
        formData.dueDate,
        formData.division,
        formData.receivedFrom,
        formData.description,
        formData.origin,
        formData.serviceProviderNetwork,
        formData.subject,
        formData.description); //Set the demand field to be the descriptions

     const taskInput: TaskInputs = new TaskInputs(demand, taskStatus, operations);
     return taskInput;
  }


  private disableForm(): void {
    this.caseForm.controls['receivedFrom'].disabled;
    this.caseForm.controls['subject'].disabled;
    this.caseForm.controls['description'].disabled;
    this.caseForm.controls['origin'].disabled;
    this.caseForm.controls['serviceProviderNetwork'].disabled;
    this.caseForm.controls['division'].disabled;
    this.caseForm.controls['receiptAcknowledgementDate'].disabled;

    this.caseForm.controls['progress'].disabled;
    this.caseForm.controls['assignedDate'].disabled;
    this.caseForm.controls['fmAllocated'].disabled;
    this.caseForm.controls['submissionDate'].disabled;
    this.caseForm.controls['operations'].disabled;
  }
}
