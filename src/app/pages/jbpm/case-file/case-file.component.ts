import { Request, CaseRequest, Settings, Status } from './../../../jbpm/domain/demand';
import { ProcessService } from './../../../jbpm/service/process.service';
import { TaskService } from './../../../jbpm/service/task.service';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CaseService } from '../../../jbpm/service/case.service';

@Component({
  selector: 'ngx-case-file',
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})

export class CaseFileComponent implements OnInit {
  @Input() case: any;
  @Input() taskSummary?: Promise<any>;

  caseForm: FormGroup;

  closureStatusList: any[] = [
    {value: 'true', description: 'Close'},
    {value: 'false', description: 'Re-Assign'}];
  origins: string[] = ['Engagement', 'Telecon', 'Email from Scheme'];
  caseValidityList: string[] = ['Valid', 'Invalid'];
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
  enableTracking: boolean;
  enableClassification: boolean = true;

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
      const processId = res['task-proc-inst-id'];
      const taskId = res['task-id'];

      if ( this.taskName !== 'Create Request' ) { //Any other task except for the request must go in
        // this.taskService.getTaskInputs(containerId, taskId).subscribe(input  => {
        // });
      }
      if (this.taskName === 'Tracking') {
        this.enableTracking = true;
        this.enableClassification = false;
      }

      if ( res['task-status'] === Status.COMPLETED) {
        this.caseForm.disable({onlySelf: true});
      }
    });

    this.populateFormControls();
  }

  private populateFormControls(): void {

    this.caseService.getCaseModel(this.case['container-id'], this.case['case-id']).subscribe(
      data => {

        if (data === null || data === undefined) {
          return;
        }
        const request = data['io.jumpco.metropolitan.tracker.demand.Request'];

        this.caseForm.controls['dueDate'].setValue(new Date(request['dueDate']['java.util.Date']));
        this.caseForm.controls['receivedDate'].setValue(new Date(request['receivedDate']['java.util.Date']))
        this.caseForm.controls['assignedDate'].setValue(new Date(request['assignedDate']['java.util.Date']));
        this.caseForm.controls['receiptAcknowledgementDate'].setValue(new Date(request['receiptAcknowledgementDate']['java.util.Date']));
        this.caseForm.controls['submissionDate'].setValue(new Date(request['completeDate']['java.util.Date']));

        this.caseForm.controls['receivedFrom'].setValue(request['emailFrom']);
        this.caseForm.controls['subject'].setValue(request['subject']);
        this.caseForm.controls['description'].setValue(request['description']);
        this.caseForm.controls['origin'].setValue(request['origin']);
        this.caseForm.controls['serviceProviderNetwork'].setValue(request['spnInvolved'][0]);
        this.caseForm.controls['division'].setValue(request['division']);
        this.caseForm.controls['priority'].setValue(request['priority']);

        this.caseForm.controls['fundAdministrator'].setValue(request['fmAdministrator']);
        this.caseForm.controls['manager'].setValue(request['fmManager']);
        this.caseForm.controls['operationsUser'].setValue(request['assignedTo']);
        this.caseForm.controls['operationsHod'].setValue(request['assignedHod']);
        this.caseForm.controls['tag'].setValue(request['tags'][0]);
        this.caseForm.controls['caseValidity'].setValue(request['validity']);

      });
  }

  private initialiseFormControl() {
    this.caseForm = new FormGroup({
      receivedDate: new FormControl('', [Validators.required]),
      origin: new FormControl('', Validators.required),
      receivedFrom: new FormControl('', [Validators.required, Validators.email]),
      division: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      receiptAcknowledgementDate: new FormControl('', Validators.required),
    //  dueDate: new FormControl({value: '', disabled: true}, Validators.required),

      dueDate: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      fundAdministrator: new FormControl('', Validators.required),
      manager: new FormControl('', Validators.required),
      operationsUser: new FormControl('', Validators.required),
      operationsHod: new FormControl('', Validators.required),


      serviceProviderNetwork: new FormControl('', Validators.required),
      assignedDate: new FormControl('', Validators.required),
      create: new FormControl('', Validators.required),
      submissionDate: new FormControl('', Validators.required),
      fmAllocated: new FormControl('', Validators.required),
      operations: new FormControl('', Validators.required),
      operationsResponse: new FormControl('', Validators.required),
      caseValidity: new FormControl('', Validators.required),
      tag: new FormControl('', Validators.required),
      closureStatus: new FormControl('', Validators.required),

    });
  }

  formSubmit(userProfileForm: FormGroup) {

    const formdata = userProfileForm.value;

    const containerId = this.taskSummaryValue['task-container-id'];
    const taskId = this.taskSummaryValue['task-id'];
    const taskStatus = this.taskSummaryValue['task-status'];

    if (taskStatus === undefined) { throw Error('Task Status is missing'); }

    if (  taskStatus === Status.CREATED) {
      this.taskService.activateTask(containerId, taskId);
    }

    if (  taskStatus === Status.READY) {
         this.taskService.claimTask(containerId, taskId);
         this.taskService.startClaimedTask(containerId, taskId);
    } else if (taskStatus === Status.COMPLETED) { return;  }

    this.taskService.getTaskInformation(containerId, taskId).subscribe(taskRes => {

        const caseRequest: CaseRequest = this.mapper(formdata, taskRes['task-status']);
        this.taskService.completeClaimedTask(containerId, taskId, caseRequest).subscribe(res => {
          alert('Task Completed Successfullty');
          this.router.navigate(['pages/jbpm/cases-table'], {replaceUrl: true});
        }, error => {
            console.error('========= Task Complete Error ===========');
            console.error(error );
        });
   });
  }

  private mapper(formdata: any, taskStatus: string): CaseRequest {
    const requestObj = new Request(formdata.assignedDate,
      formdata.receivedDate,
      formdata.receiptAcknowledgementDate,
      formdata.dueDate,
      formdata.origin,
      formdata.receivedFrom,
      formdata.subject,
      formdata.description,
      formdata.operationsUser,
      formdata.operationsHod,
      formdata.fundAdministrator,
      formdata.manager,
      [formdata.serviceProviderNetwork],
      [formdata.tag],
      null,
      formdata.submissionDate,
      formdata.caseValidity,
      formdata.priority,
      formdata.division);

     const caseInputs: CaseRequest = new CaseRequest(requestObj, new Settings(), taskStatus, [] );
     return caseInputs;
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
