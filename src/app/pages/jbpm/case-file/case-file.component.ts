import {Request, CaseRequest, Settings, Status, TaskNames} from './../../../jbpm/domain/demand';
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
import {NbToastrService} from '@nebular/theme';
import {UserDetails} from '../../../authentication/model/user.details';

@Component({
  selector: 'ngx-case-file',
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})

export class CaseFileComponent implements OnInit {
  @Input() case: any;
  @Input() taskSummary?: Promise<any>;

  requestId: number = null;
  mappedVariables: Array<any> = null;
  caseForm: FormGroup;
  requestType: string = null;
  requestStatus: string = null;
  requestCaseId: string = null;

  readonly closeCaseList: any[] = [
    {value: true, description: 'Close'},
    {value: false, description: 'Re-Assign'}];

  readonly closureStatusList: any[] = ['Duplicate', 'Cancelled', 'Complete'];

  readonly origins: string[] = ['Engagement', 'Telecon', 'Email'];
  readonly caseValidityList: string[] = ['Valid', 'Invalid'];
  readonly serviceProviderNetworks: any[] = [{ value: 'GEMS', description: 'Government Employee Medical Scheme' }];
  readonly divisions: any[] = [{ value: 'MHRS', description: 'Medscheme Health Risk Solutions' },
                               { value: 'DENIS', description: 'Dental Management Services' }];
  readonly priorities: any[] = [
    {value: 0, description: 'High'},
    {value: 1, description: 'Medium'},
    {value: 3, description: 'Low'}];

  operationsResponse: boolean = false;
  taskCompleted: boolean = true;
  taskName: string = '';
  caseId: string = '';

  taskSummaryValue: any;
  enableTracking: boolean;
  showClosureStatus: boolean = false;
  enableClassification: boolean = true;

  constructor(
    protected caseService: CaseService,
    protected taskService: TaskService,
    protected processService: ProcessService,
    private toastrService: NbToastrService,
    protected router: Router,
    protected http: HttpClient) {
  }

  get formData() { return this.caseForm.value; }

  ngOnInit(): void {

    this.initialiseFormControl();

    this.taskSummary.then(res => {
      this.taskSummaryValue = res;
      this.taskName = res['task-name'];
      this.caseId = this.case['case-id'];

      if (this.taskName === TaskNames.TRACKING) {
        this.enableTracking = true;
        this.enableClassification = false;

        this.taskService.getTaskInputs(
          res['task-container-id'],
          res['task-id']).subscribe( inputs => {
          this.populateFields(inputs['request']);
        });

        this.processService.getProcessInformation(
          res['task-container-id'],
          res['task-proc-inst-id'])
          .subscribe(proces => this.caseId = proces['correlation-key'] );
      }

      if ( res['task-status'] === Status.COMPLETED) {
          // this.caseForm.disable({onlySelf: true});
           this.taskCompleted = false;
      }
    });

    this.populateFormControls();
  }

  private populateFormControls(): void {
   if (this.case === undefined && this.case['case-id'] === undefined) { return; }
    this.caseService.getCaseModel(this.case['container-id'], this.case['case-id']).subscribe(
      data => {
        if (data === null || data === undefined) {
          return;
        }
        this.populateFields(data);
      });
  }

  private populateFields(data) {
    const request = data['io.jumpco.metropolitan.tracker.demand.Request'];
    this.requestId = request?.id;
    this.mappedVariables = request?.mappedVariables;

    this.requestType = request?.requestType;
    this.requestStatus = request?.requestStatus;
    this.requestCaseId = request?.caseId;


    this.setDatesOnFields(request);

    this.caseForm.controls['receivedFrom'].setValue(request['emailFrom']);
    this.caseForm.controls['subject'].setValue(request['subject']);
    this.caseForm.controls['description'].setValue(request['description']);
    this.caseForm.controls['origin'].setValue(request['origin']);

    if ( request['spnInvolved']) {
      this.caseForm.controls['serviceProviderNetwork'].setValue(request['spnInvolved'][0]);
    }
    this.caseForm.controls['division'].setValue(request['division']);
    this.caseForm.controls['priority'].setValue(request['priority']);

    this.caseForm.controls['fundAdministrator'].setValue(request['fmAdministrator']);
    this.caseForm.controls['manager'].setValue(request['fmManager']);
    this.caseForm.controls['operationsUser'].setValue(request['assignedTo']);
    this.caseForm.controls['operationsHod'].setValue(request['assignedHod']);
    this.caseForm.controls['caseValidity'].setValue(request['validity']);
    if ( request['tags']) {
      this.caseForm.controls['tag'].setValue(request['tags'][0]);
    }
  }

  private getDate(value: string, data: any): Date {
    if (data[`${value}`]) {
      const date = (data[`${value}`]['java.util.Date']) ? data[`${value}`]['java.util.Date'] : data[`${value}`]['java.sql.Timestamp'];
      return new Date(date);
    }
    return null;
  }

  private setDatesOnFields(request): void {
    if (this.getDate('dueDate', request)) {
      this.caseForm.controls['dueDate'].setValue(this.getDate('receivedDate', request));
    }
    if (this.getDate('receivedDate', request) !== null) {
      this.caseForm.controls['receivedDate'].setValue(this.getDate('receivedDate', request));
    }
    if (this.getDate('assignedDate', request)) {
      this.caseForm.controls['assignedDate'].setValue(this.  getDate('assignedDate', request));
    }
    if (this.getDate('receiptAcknowledgementDate', request)) {
      this.caseForm.controls['receiptAcknowledgementDate']
        .setValue(this.getDate('receiptAcknowledgementDate', request));
    }
    if (this.getDate('completeDate', request)) {
      this.caseForm.controls['submissionDate']
        .setValue(this.getDate('completeDate', request));
    }
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
      closeCase: new FormControl('', Validators.required),
      closureStatus: new FormControl('', Validators.required),

    });
  }

  formSubmit(userProfileForm: FormGroup) {

    const formdata = userProfileForm.value;

    const containerId = this.taskSummaryValue['task-container-id'];
    const taskId = this.taskSummaryValue['task-id'];
    const taskStatus = this.taskSummaryValue['task-status'];
    const processInstanceId = this.taskSummaryValue['task-proc-inst-id'];

    if (taskStatus === undefined) { throw Error('Task Status is missing'); }

    if (  taskStatus === Status.CREATED) {
      this.taskService.activateTask(containerId, taskId);
    }

    if (  taskStatus === Status.READY) {
      this.claimAndStart(containerId, taskId);
    } else if (taskStatus === Status.COMPLETED) { return;  }

    this.taskService.getTaskInformation(containerId, taskId).subscribe(taskRes => {

        const caseRequest: CaseRequest = this.mapper(formdata,
          ( taskRes['task-name'] === TaskNames.TRACKING && formdata.closeCase),
            taskRes['task-status'], formdata.closureStatus);

        if (!caseRequest?.closeCase && taskRes['task-name'] === TaskNames.TRACKING) {
          this.taskService.delegate(containerId, taskRes['task-id']);
          this.showToast('Task has been released successfully');
        } else {

          this.taskService.completeClaimedTask(containerId, taskId, caseRequest).subscribe(res => {
            this.showToast('Task completed successfully');
            this.taskService.getAvailableTasksForProcess(processInstanceId).subscribe(taskres  => {
                   if ( taskres['task-summary'][0]['task-name'] === TaskNames.TRACKING) {
                      this.taskService.delegate(containerId,
                        taskres['task-summary'][0]['task-id']);
                   }
             });
          }, error => {
            console.error('========= Task Complete Error ===========');
            console.error(error );
          });
        }
   });
  }

  private claimAndStart(containerId, taskId) {
    this.taskService.claimTask(containerId, taskId);
    this.taskService.startClaimedTask(containerId, taskId);
  }

  saveCaseData(form: FormGroup ): void {
    const caseRequest: CaseRequest = this.mapper(this.formData, false);
    this.taskService.saveCaseData(this.case['container-id'], this.case['case-id'], caseRequest).subscribe(res => {
      this.showToast('Saved Data Successfully', false);
    });
  }

  private mapper(formdata: any, closeCase: boolean, taskStatus?: string, closureStatus?: string): CaseRequest {
    // Delegate user is a user which the task owner delegates the task to
    UserDetails.delegateUser = formdata.operationsUser;

    const requestObj = new Request(
      formdata.assignedDate,
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
      formdata.division,
      this.requestType, this.requestStatus, this.requestCaseId,
      this.requestId, this.mappedVariables);

     const caseInputs: CaseRequest = new CaseRequest(requestObj,
       new Settings(),
       taskStatus,
       closeCase,
       closureStatus,
       []);
     return caseInputs;
  }

   private navigate(): void {
     this.router.navigate(['pages/jbpm/cases-table'], {replaceUrl: true});
   }


  private showToast(msg: string, navigate: boolean = true): void {
    // @ts-ignore
    this.toastrService.show(
      `${msg}`,
      ``,
      {
        destroyByClick: false,
        duplicatesBehaviour: undefined,
        duration: 3000,
        hasIcon: false,
        icon: undefined,
        iconPack: '',
        limit: 0,
        preventDuplicates: true,
        status: 'success',
        toastClass: '',
        // @ts-ignore
        position: 'top-end'});

    setTimeout(() => {
        if (navigate) {
          this.navigate();
        }
    }, 3000);
  }

  selectedValue(event: any): void {
    this.showClosureStatus =  event.value.valueOf();
  }
}
