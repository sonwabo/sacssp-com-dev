import { Request, CaseRequest, Settings, Status, TaskNames } from './../../../jbpm/domain/demand';
import { ProcessService } from './../../../jbpm/service/process.service';
import { TaskService } from './../../../jbpm/service/task.service';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CaseService} from '../../../jbpm/service/case.service';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {UserDetails} from '../../../authentication/model/user.details';
import {UserRoles} from '../../../authentication/model/user-roles';
import {DepartmentManagementService} from '@app/jbpm/service/department-management.service';
import {UserManagementService} from '@app/jbpm/service/user-management.service';

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
  readonly closureStatusList: string[] = ['Duplicate', 'Cancelled', 'Complete'];
  readonly origins: string[] = ['Engagement', 'Telecon', 'Email'];
  readonly caseValidityList: string[] = ['Valid', 'Invalid'];
  readonly priorities: any[] = [
    {value: 0, description: 'High'},
    {value: 1, description: 'Medium'},
    {value: 3, description: 'Low'}];


  readonly divisions: Array<any> = new Array<any>();
  readonly operationDepartmentList: Array<any> = new Array<any>();
  readonly fundManagementDepartmentList: Array<any> = new Array<any>();

  readonly serviceProviderNetworks: Array<any> = new Array<any>();
  readonly schemeList: Array<any> = new Array<any>();

  fundAdministratorList: Array<any> = new Array<any>();
  operationsList: Array<any> = new Array<any>();
  schemeOfficialsList: Array<any> = new Array<any>();


  taskCompleted: boolean = true;
  taskName: string = '';
  caseId: string = '';
  container: string;

  taskSummaryValue: any;
  enableTracking: boolean;
  showClosureStatus: boolean = false;
  resassign: string = null;

  enableClassification: boolean = true;

  submitted = false;
  loading = false;
  isReadOnly: boolean = false;

  constructor(
    protected caseService: CaseService,
    protected taskService: TaskService,
    protected processService: ProcessService,
    protected departmentManService: DepartmentManagementService,
    protected usermanagenent: UserManagementService,
    protected toastrService: NbToastrService,
    protected router: Router,
    protected http: HttpClient) {
  }

  loadDepartmentData(): void {
    this.departmentManService.getDepartments('divisions').subscribe(res => {
      (res['_embedded']?.divisions as Array<any>)?.forEach(value => this.divisions.push(value));
    });
    this.departmentManService.getDepartments('schemes').subscribe(res => {
      (res['_embedded']?.schemes as Array<any>)?.forEach(value => this.schemeList.push(value));
    });
    this.departmentManService.getDepartments('serviceProviderNetworks').subscribe(res => {
      // tslint:disable-next-line:max-line-length
      (res['_embedded']?.serviceProviderNetworks as Array<any>)?.forEach(value => this.serviceProviderNetworks.push(value));
    });

    this.departmentManService.getDepartments('operationsDepartments').subscribe(res => {
      // tslint:disable-next-line:max-line-length
      (res['_embedded']?.operationsDepartments as Array<any>)?.forEach(value => this.operationDepartmentList.push(value));
    });
    this.departmentManService.getDepartments('fundManagementDepartmentses').subscribe(res => {
      // tslint:disable-next-line:max-line-length
      (res['_embedded']?.fundManagementDepartmentses as Array<any>)?.forEach(value => this.fundManagementDepartmentList.push(value));
    });
  }

  loadUsers(): void {

    this.usermanagenent.getUsers('fundAdministrators').subscribe(res => {
      // tslint:disable-next-line:max-line-length
      (res['_embedded']?.fundAdministrators as Array<any>)?.forEach(value => this.fundAdministratorList.push(value));
    });
    this.usermanagenent.getUsers('operationses').subscribe(res => {
      // tslint:disable-next-line:max-line-length
      (res['_embedded']?.operationses as Array<any>)?.forEach(value => this.operationsList.push(value));
    });
    this.usermanagenent.getUsers('schemeOfficials').subscribe(res => {
      // tslint:disable-next-line:max-line-length
      (res['_embedded']?.schemeOfficials as Array<any>)?.forEach(value => this.schemeOfficialsList.push(value));
    });
  }

  get formData() {
    return this.caseForm.value;
  }

  ngOnInit(): void {

    this.initialiseFormControl();

    this.taskSummary.then(res => {
      this.taskSummaryValue = res;
      this.taskName = res['task-name'];

      this.caseId = this.case['case-id'];
      this.container = res['task-container-id'];

      if (this.taskName === TaskNames.TRACKING) {
        this.enableTracking = true;
        this.enableClassification = false;

        this.taskService.getTaskInputs(
          res['task-container-id'],
          res['task-id']).subscribe(inputs => {
            if ( UserDetails.getRoles().includes(UserRoles.OPS_USER_ROLE)) {
              this.populateFields(inputs['request']);
            }
        });

        this.processService.getProcessInformation(
          res['task-container-id'],
          res['task-proc-inst-id'])
          .subscribe(proces => this.caseId = proces['correlation-key']);

        // Disable button for non ops-users
        // this.taskCompleted =  this.populateFields(inputs['request']);;
      }

      if (res['task-status'] === Status.COMPLETED) {
        // this.caseForm.disable({onlySelf: true});
        this.taskCompleted = false;
      }
    });

    this.populateFormControls();
    this.loadData();
  }

  dateTime(event: any): void {
    console.log(event);
    this.usermanagenent.updateDueDate(this.caseId, new Date(event).getTime());
  }

  private populateFormControls(): void {
    if (this.case === undefined && this.case['case-id'] === undefined) {
      return;
    }
    this.caseService.getCaseModel(this.case['container-id'], this.case['case-id']).subscribe(
      data => {
        if (data === null || data === undefined) {
          return;
        }
        this.populateFields(data);
      });
  }

  loadData(): void {
    this.loadUsers();
    this.loadDepartmentData();
  }

  private populateFields(data) {
    const request = data['io.jumpco.metropolitan.tracker.demand.Request'];
    this.requestId = request?.id;
    this.mappedVariables = request?.mappedVariables;

    this.requestType = request?.requestType;
    this.requestStatus = request?.caseState;
    if (this.requestStatus === null) {
      this.requestStatus = request?.requestStatus;
    }
    // Need to fix in JBPM and remove this hack
    if (this.requestStatus === 'Close') { this.requestStatus = 'Completed'; }

    this.requestCaseId = request?.caseId;
    this.setDatesOnFields(request);

    if  (request['origin'] === 'Email') {

       this.disableFormElements(['receivedFrom', 'subject', 'description', 'origin']);
    }

    this.caseForm.controls['receivedFrom'].setValue(request['emailFrom']);
    this.caseForm.controls['subject'].setValue(request['subject']);
    this.caseForm.controls['description'].setValue(request['description']);
    this.caseForm.controls['origin'].setValue(request['origin']);

    this.caseForm.controls['schemesDepartment'].setValue(request['scheme']);
    this.caseForm.controls['division'].setValue(request['division']);
    this.caseForm.controls['priority'].setValue(request['priority']);

    this.caseForm.controls['fundAdministrator'].setValue(request['fmAdministrator']);
    this.caseForm.controls['fundManager'].setValue(request['fmManager']);
    this.caseForm.controls['operationsUser'].setValue(request['assignedTo']);
    this.caseForm.controls['operationsHod'].setValue(request['assignedHod']);
    this.caseForm.controls['caseValidity'].setValue(request['validity']);
    this.caseForm.controls['operationsDepartment'].setValue(request['operationsDepartment']);


    if (request['tags']) {
      this.caseForm.controls['tag'].setValue(request['tags'][0]);
    }
  }

  disableFormElements(list: string[]): void {
    this.isReadOnly = true;
    list.forEach(contrl => {
      // this.caseForm.controls[`${contrl}`].disable({onlySelf: true});
    });
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
      this.caseForm.controls['dueDate'].setValue(this.getDate('dueDate', request));
    }
    if (this.getDate('receivedDate', request) !== null) {
      this.caseForm.controls['receivedDate'].setValue(this.getDate('receivedDate', request));
    }
    if (this.getDate('assignedDate', request)) {
      this.caseForm.controls['assignedDate'].setValue(this.getDate('assignedDate', request));
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
      receivedFrom: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl('', Validators.required),
      origin: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      schemesDepartment: new FormControl('', Validators.required),
      division: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      fundAdministrator: new FormControl('', Validators.required),
      fundManager: new FormControl('', Validators.required),
      operationsUser: new FormControl('', Validators.required),
      operationsHod: new FormControl('', []),
      operationsDepartment: new FormControl('', Validators.required),
      fundManagementDepartment: new FormControl('', Validators.required),

      caseValidity: new FormControl('', []),
      tag: new FormControl('', []),

      assignedDate: new FormControl('', [Validators.required]),
      receivedDate: new FormControl('', [Validators.required]),
      dueDate: new FormControl('', []),
      receiptAcknowledgementDate: new FormControl('', []),
      submissionDate: new FormControl('', []),

      //  dueDate: new FormControl({value: '', disabled: true}, Validators.required),
      create: new FormControl('', []),
      status: new FormControl('', []),
      serviceProviderNetwork: new FormControl('', []),
      fmAllocated: new FormControl('', []),
      operations: new FormControl('', []),
      closeCase: new FormControl('', []),
      closureStatus: new FormControl('', []),

    });
  }

  formSubmit(userProfileForm: FormGroup) {
    this.submitted = true;
    if (this.caseForm.invalid) {
      return;
    }

    const formdata = userProfileForm.value;

    const containerId = this.taskSummaryValue['task-container-id'];
    const taskId = this.taskSummaryValue['task-id'];
    const taskStatus = this.taskSummaryValue['task-status'];
    const processInstanceId = this.taskSummaryValue['task-proc-inst-id'];

    if (taskStatus === undefined) {
      throw Error('Task Status is missing');
    }

    if (taskStatus === Status.CREATED) {
      this.taskService.activateTask(containerId, taskId);
    }

    if (taskStatus === Status.READY) {
      this.claimAndStart(containerId, taskId);
    } else if (taskStatus === Status.COMPLETED) {
      return;
    }

    this.taskService.getTaskInformation(containerId, taskId).subscribe(taskRes => {

      const caseRequest: CaseRequest = this.mapper(formdata,
        (taskRes['task-name'] === TaskNames.TRACKING && formdata.closeCase),
        taskRes['task-status'], formdata.closureStatus);

      if (!caseRequest?.closeCase && this.resassign !== null && taskRes['task-name'] === TaskNames.TRACKING) {
        this.taskService.delegate(containerId, taskRes['task-id'], this.caseId);
        this.showToast('Task has been released successfully');
      } else {

        if (this.requiredData((this.showClosureStatus === false
          && taskRes['task-name'] === TaskNames.TRACKING), caseRequest)) {
          return;
        }

        if (!UserDetails.getRoles().includes(UserRoles.OPS_USER_ROLE) &&  taskRes['task-name'] === TaskNames.TRACKING) {
            this.taskService.releaseTask(containerId, taskId, UserDetails.delegateUser);
        }

        this.taskService.completeClaimedTask(containerId, taskId, caseRequest).subscribe(res => {
          this.showToast('Task completed successfully');
          this.taskService.getAvailableTasksForProcess(processInstanceId).subscribe(taskres => {
            if (taskres['task-summary'][0]['task-name'] === TaskNames.TRACKING) {
              this.taskService.delegate(containerId,
                taskres['task-summary'][0]['task-id'], this.caseId);
            }
          });
        }, error => {
          this.loading = false;
          this.handleError();
        });
      }
    });
  }
  get form() { return this.caseForm.controls; }
  handleError() {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger' });
  }

  private requiredData(isTracking: boolean, caseRequest: CaseRequest): boolean {
    let res = false;

    if (isTracking) {
      if (!caseRequest.closeCase && caseRequest.closureStatus.length === 0) {
        res = true;
      }
      if (caseRequest?.request?.receiptAcknowledgementDate['java.util.Date'].length === 0 ||
        caseRequest?.request?.completeDate['java.util.Date'].length === 0) {
        res = true;
      }
      this.showToast('Please fill required Dates', false, 'warning');
    }
    return res;
  }

  private claimAndStart(containerId, taskId) {
    this.taskService.claimTask(containerId, taskId);
    this.taskService.startClaimedTask(containerId, taskId);
  }

  saveCaseData(form: FormGroup): void {

    this.submitted = true;
    if (this.caseForm.invalid) {
      return;
    }
    this.loading = true;
    const caseRequest: CaseRequest = this.mapper(this.formData, false);
    this.taskService.saveCaseData(this.container, this.caseId, caseRequest).subscribe(res => {
      this.toastrService.show(
        'Case Saved successfully',
        `Case has been succesfully saved`,
        { 'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'success' });
      this.loading = false;
    }, error => {
      this.loading = false;
      this.handleError();
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
      formdata.operationsDepartment,
      formdata.fundManagementDepartment,
      formdata.operationsHod,
      formdata.fundAdministrator,
      formdata.fundManager,
      formdata.schemesDepartment,
      [formdata.schemesDepartment],
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

  private showToast(msg: string, navigate: boolean = true, _staus: NbComponentStatus = 'success'): void {
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
        status: _staus,
        toastClass: '',
        // @ts-ignore
        position: 'top-end',
      });

    setTimeout(() => {
      if (navigate) {
        this.navigate();
      }
    }, 3000);
  }

  selectedValue(event: any): void {
    this.showClosureStatus = event.value.valueOf();
    this.resassign = 'Yes';
  }

  selectedSchemeOfficial(official: any): void {

    this.departmentManService.getDepartment(official?._links?.scheme.href).subscribe(res_ => {
      this.caseForm.controls['schemesDepartment'].setValue(res_.name);
    });
    this.departmentManService.getDepartment(official?._links?.division.href).subscribe(res_ => {
      this.caseForm.controls['division'].setValue(res_.name);
    });
    this.usermanagenent.getUser(official?._links?.fundAdministrator.href).subscribe(res => {
      this.caseForm.controls['fundAdministrator'].setValue(res?.email);
      this.usermanagenent.getUser(res?._links?.fundManager.href).subscribe(res_ => {
        this.caseForm.controls['fundManager'].setValue(res_.email);
        this.departmentManService.getDepartment(res_?._links?.[`fundManagementDepartment`].href).subscribe(_res => {
          this.caseForm.controls[`fundManagementDepartment`].setValue(_res.name);
        });

      });
    });
  }

  selectedUser(user: any, manager: string): void {

    this.usermanagenent.getUser(user?.['_links'][`${manager}`]?.href).subscribe(res => {
      this.caseForm.controls[`${manager}`].setValue(res?.email);
    });

    const department = (manager === 'operationsHod') ? 'operationsDepartment' : 'fundMagementDepartmentses';
    this.usermanagenent.getUser(user?._links?.[`${manager}`]['href']).subscribe(res_ => {
      this.departmentManService.getDepartment(res_?._links?.[`${department}`].href).subscribe(_res => {
        const formField = (department === 'operationsDepartment') ? 'operationsDepartment' : 'fundManagementDepartment';
        this.caseForm.controls[`${formField}`].setValue(_res.name);
      });
    });
  }

}
