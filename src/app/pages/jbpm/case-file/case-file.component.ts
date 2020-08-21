import {Demand, Status, TaskInputs, TaskNames} from './../../../jbpm/domain/demand';
import { environment } from './../../../../environments/environment';
import { ProcessService } from './../../../jbpm/service/process.service';
import { TaskService } from './../../../jbpm/service/task.service';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component, ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
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
  @Input() taskSummary?: Promise<any>;

  caseForm: FormGroup;
  fundManagementUsers: string[] = ['fund-administrator', 'fund-manager'];
  fundManagementManagers: string[] = ['fund-manager'];
  origins: string[] = ['Engagement', 'Telecon', 'Email from Scheme'];
  operationList: string[] = ['Sent to Operations', 'Close Case'];
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
  operationsResponse: boolean = false;
  taskCompleted: boolean = true;
  taskName: string = '';
  taskSummaryValue: any;

  constructor(
    protected caseService: CaseService,
    protected taskService: TaskService,
    protected processService: ProcessService,
    protected router: Router,
    protected http: HttpClient) {
  }

  ngOnInit(): void {

    this.initialiseFormControl();

    this.taskSummary.then(res => {

      this.taskSummaryValue = res;
      this.taskName = res['task-name'];
      const containerId = res['task-container-id'];
      const taskId = res['task-id'];

      if ( this.taskName !== 'Create Request' ) { //Any other task except for the request must go in

        this.taskService.getTaskInputs(containerId, taskId).subscribe(input  => {

          if ( this.taskName === TaskNames.FUND_MANAGEMENT_TASK) {
            if (input['operations-response'] !== undefined && input['operations-response'].length > 0) {
              this.caseForm.controls['operationsResponse'].setValue( input['operations-response']);
              this.caseForm.controls['operationsResponse'].disable({onlySelf: true});
              this.operationsResponse = true;
            }
          }

          if (this.taskName === TaskNames.OPERATIONS_MANAGEMENT_TASK) {
            this.sendToOperations = true;
            this.operationsResponse = true;
            this.caseForm.controls['operations'].setValue(input['operations-directive']);
            this.caseForm.controls['operations'].disable({onlySelf: true});
          }
        });
      }

      if ( res['task-status'] === Status.COMPLETED) {
        this.caseForm.disable({onlySelf: true});
      }

    });

    this.populateFormControls();
  }

  private populateFormControls() {

    this.caseService.getCaseModel(this.case['container-id'], this.case['case-id']).subscribe(
      data => {
        this.caseForm.controls['dueDate'].setValue(this.case['case-sla-due-date']);
        this.caseForm.controls['receivedDate'].setValue(this.case['case-started-at']);

        if (data === null || data === undefined) {
          return;
        }

        this.caseForm.controls['receivedFrom'].setValue(data.clientEmail);
        this.caseForm.controls['subject'].setValue(data.subject);
        this.caseForm.controls['description'].setValue(data.demand);
        this.caseForm.controls['origin'].setValue(data.origin);
        this.caseForm.controls['serviceProviderNetwork'].setValue(data.spn);
        this.caseForm.controls['division'].setValue(data.division);
        this.caseForm.controls['receiptAcknowledgementDate'].setValue(data.acknowledgementDate['java.util.Date']);
      });
  }

  private initialiseFormControl() {
    this.caseForm = new FormGroup({
      receivedDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      origin: new FormControl('', Validators.required),
      receivedFrom: new FormControl('', [Validators.required, Validators.email]),
      division: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      receiptAcknowledgementDate: new FormControl('', Validators.required),
      dueDate: new FormControl({value: '', disabled: true}, Validators.required),
      status: new FormControl('', Validators.required),
      assignedTo: new FormControl('', Validators.email),
      manager: new FormControl('', Validators.email),
      serviceProviderNetwork: new FormControl('', Validators.required),
      assignedDate: new FormControl('', Validators.required),
      progress: new FormControl('', Validators.required),
      submissionDate: new FormControl('', Validators.required),
      fmAllocated: new FormControl('', Validators.required),
      operations: new FormControl('', Validators.required),
      operationsResponse: new FormControl('', Validators.required),

    });
  }

  formSubmit(userProfileForm: FormGroup) {

    const formdata = userProfileForm.value;
    const containerId = this.taskSummaryValue['task-container-id'];
    const taskId = this.taskSummaryValue['task-id'];
    const taskStatus = this.taskSummaryValue['task-status'];

    if (  taskStatus === Status.READY) {
         this.taskService.claimTask(containerId, taskId);
         this.taskService.startClaimedTask(containerId, taskId);
    } else if (taskStatus === Status.COMPLETED) { return;  }

    this.taskService.getTaskInformation(containerId, taskId).subscribe(taskRes => {

        const input: TaskInputs = this.mapper(formdata, taskRes['task-status']);

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
    this.sendToOperations = (event === 'Sent to Operations');
  }

  private mapper(formData: any, taskStatus: string): TaskInputs {

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

     const taskInput: TaskInputs = new TaskInputs(demand, taskStatus, formData.operations, formData.operationsResponse);
     return taskInput;
  }


  private disableForm(): void {
    this.caseForm.controls['receivedFrom'].disable({onlySelf: true});
    this.caseForm.controls['subject'].disable({onlySelf: true});
    this.caseForm.controls['description'].disable({onlySelf: true});
    this.caseForm.controls['origin'].disable({onlySelf: true});
    this.caseForm.controls['serviceProviderNetwork'].disable({onlySelf: true});
    this.caseForm.controls['division'].disable({onlySelf: true});
    this.caseForm.controls['receiptAcknowledgementDate'].disable({onlySelf: true});

    this.caseForm.controls['progress'].disable({onlySelf: true});
    this.caseForm.controls['assignedDate'].disable({onlySelf: true});
    this.caseForm.controls['fmAllocated'].disable({onlySelf: true});
    this.caseForm.controls['submissionDate'].disable({onlySelf: true});
    this.caseForm.controls['operations'].disable({onlySelf: true});
  }
}
