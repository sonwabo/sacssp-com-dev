export class Demand {
      acknowledgementDate: any;
      dueDate: any;
      division: string;
      clientEmail: string;
      from: string;
      origin: string;
      spn: string;
      demand: string;
      subject: string;

      // tslint:disable-next-line:max-line-length
      constructor(acknowledgementDate: Date, dueDate: Date, division: string, clientEmail: string, from: string, origin: string, spn: string, subject: string, demand: string) {

        const acknowledgement = ( acknowledgementDate instanceof Date )
                      ? acknowledgementDate.getTime()
                      : acknowledgementDate;
        this.acknowledgementDate = {'java.util.Date' : acknowledgement };

        const due = ( dueDate instanceof Date )
                  ? dueDate.getTime()
                  : acknowledgementDate;

        this.dueDate = {'java.util.Date' : due };
        this.division = division;
        this.clientEmail = clientEmail;
        this.from = from;
        this.origin = origin;
        this.spn = spn;
        this.subject = subject;
        this.demand = demand;
      }
  }

export class Request {

  id: number;
  mappedVariables: Array<any>;
  origin: string;
  emailFrom: string;
  subject: string;
  description: string;
  priority: number;
  receivedDate: any;
  receiptAcknowledgementDate: any;
  assignedDate: any;
  dueDate: any;
  assignedTo: string;
  operationsDepartment: string;
  fundManagementDepartment: string;
  assignedHod: string;
  fmAdministrator: string;
  fmManager: string;
  scheme: string;
  spnInvolved: Array<string>;
  tags: Array<string>;
  categories: any;
  completeDate: any;
  division: string;
  validity: string;

  requestType: string;
  requestStatus: string;
  caseId: string;

  // tslint:disable-next-line:max-line-length
  constructor(
              assignedDate: any,
              receivedDate: any,
              acknowledgementDate: any,
              dueDate: any,
              origin: string,
              emailFrom: string,
              subject: string,
              description: string,
              assignedTo: string,
              operationsDepartment: string,
              fundManagementDepartment: string,
              assignedHod: string,
              fmAdministrator: string,
              fmManager: string,
              scheme: string,
              spnInvolved: Array<string>,
              tags: Array<string>,
              categories: any,
              completeDate: any,
              validity: string,
              priority: number,
              division: string,
              requestType?: string,
              requestStatus?: string,
              caseId?: string,
              id?: number,
              mappedVariables?: Array<any>) {


    const assignedDateOnDate  = ( assignedDate instanceof Date )
      ? assignedDate.getTime()
      : assignedDate;
    this.assignedDate = {'java.util.Date' : assignedDateOnDate };

    const receievedOnDate  = ( receivedDate instanceof Date )
      ? receivedDate.getTime()
      : receivedDate;
    this.receivedDate = {'java.util.Date' : receievedOnDate };

    const acknowledgement = ( acknowledgementDate instanceof Date )
      ? acknowledgementDate.getTime()
      : acknowledgementDate;
    this.receiptAcknowledgementDate = {'java.util.Date' : acknowledgement };

    const due = ( dueDate instanceof Date )
      ? dueDate.getTime()
      : dueDate;
    this.dueDate = {'java.util.Date' : due };


    const _completeDate = ( completeDate instanceof Date )
      ? completeDate.getTime()
      : completeDate;
    this.completeDate = {'java.util.Date' : _completeDate };

    this.division = division?.trim();
    this.origin = origin?.trim();
    this.subject = subject?.trim();
    this.emailFrom = emailFrom?.trim();
    this.description = description?.trim();
    this.priority = priority;
    this.assignedTo = assignedTo?.trim();
    this.operationsDepartment = operationsDepartment?.trim();
    this.fundManagementDepartment = fundManagementDepartment?.trim();
    this.assignedHod = assignedHod?.trim();
    this.fmAdministrator = fmAdministrator?.trim();
    this.fmManager = fmManager?.trim();
    this.scheme = scheme;
    this.spnInvolved = spnInvolved;
    this.tags = tags;
    this.categories = categories;
    this.validity = validity?.trim();

    this.id = id;
    this.mappedVariables = mappedVariables;

    this.requestType = requestType;
    this.requestStatus = requestStatus;
    this.caseId = caseId;
  }
}


export class Settings {
    caseSLA: string;
    captureTaskSLA: string;
    classifySLA: string;
    trackSLA: string;
    sendAcknowledgements: boolean;
}

export class CaseRequest {
      request: Request;
      settings: Settings;
      attachments?: any;
      status: string;
      Comment?: string;
      TaskName?: string;
      NodeName?: string;
      Skippable?: string;
      Actorid?: string;
      GroupId?: string;
      closeCase: boolean = false;
      closureStatus: string;


  constructor(request: Request,
              settings: Settings,
              status: string,
              closeCase: boolean = false,
              closureStatus: string,
              attachments?: any,
              taskName?: string,
              comment?: string,
              nodeName?: string,
              skippable?: string,
              actorid?: string,
              groupid?: string ) {
          this.request = request;
          this.settings = settings;
          this.attachments = attachments;
          this.Comment = comment?.trim();
          this.TaskName = taskName?.trim();
          this.Skippable = skippable?.trim();
          this.Actorid = actorid?.trim();
          this.GroupId = groupid?.trim();
          this.closeCase = closeCase;
          this.closureStatus = closureStatus?.trim();
      }
}


  export class TaskInputs {
      demand: Demand;
      status: string;
      attachments?: any;
      taskName?: string;
      GroupId?: string;
      operations: string;
      operationsResponse?: string;

    // tslint:disable-next-line:max-line-length
    constructor(demand: Demand, status: string, operations: string, operationsResponse?: string,  attachments?: any, taskName?: string, GroupId?: string) {
      this.demand = demand;
      this.attachments = attachments;
      this.taskName = taskName?.trim();
      this.GroupId = GroupId?.trim();
      this.status = status?.trim();
      this.operations = operations?.trim();
      this.operationsResponse = operationsResponse?.trim();
    }
  }

  export enum CustomKeys {
    DEMANOBJECTKEY = 'io.jumpco.metropolitan.requesttracker.Demand',
  }

  export enum Status {

    CREATED = 'Created',
    READY = 'Ready',
    RESERVED = 'Reserved',
    INPROGRESS = 'InProgress',
    SUSPENDED = 'Suspended',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    ERROR = 'Error',
    EXITED = 'Exited',
    OBSOLETE = 'Obsolete',
  }


  export enum TaskNames {
    FUND_MANAGEMENT_TASK = 'Fund Management Update Task',
    OPERATIONS_MANAGEMENT_TASK = 'Operations Update Task',
    MANUAL_CLASSIFICATION = 'Manual Classification',
    TRACKING = 'Tracking',
  }
