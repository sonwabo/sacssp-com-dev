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

  origin: string;
  emailFrom: string;
  subject: string;
  description: string;
  priority: number;
  receivedDate: any;
  receiptAcknowledgementDate: any;
  dueDate: any;
  assignedTo: string;
  assignedHod: string;
  fmAdministrator: string;
  fmManager: string;
  spnInvolved: Array<string>;
  tags: Array<string>;
  categories: any;
  completeDate: any;
  division: string;
  validity: string;

  // tslint:disable-next-line:max-line-length
  constructor(receivedDate: any,
              acknowledgementDate: any,
              dueDate: any,
              origin: string,
              emailFrom: string,
              subject: string,
              description: string,
              assignedTo: string,
              assignedHod: string,
              fmAdministrator: string,
              fmManager: string,
              spnInvolved: Array<string>,
              tags: Array<string>,
              categories: any,
              completeDate: any,
              validity: string,
              priority: number,
              division: string) {

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

    this.division = division;
    this.origin = origin;
    this.subject = subject;
    this.emailFrom = emailFrom;
    this.description = description;
    this.priority = priority;
    this.assignedTo = assignedTo;
    this.assignedHod = assignedHod;
    this.fmAdministrator = fmAdministrator;
    this.fmManager = fmManager;
    this.spnInvolved = spnInvolved;
    this.tags = tags;
    this.categories = categories;
    this.validity = validity;
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


  constructor(request: Request, settings: Settings, status: string, attachments?: any) {
          this.request = request;
          this.settings = settings;
          this.attachments = attachments;
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
      this.taskName = taskName;
      this.GroupId = GroupId;
      this.status = status;
      this.operations = operations;
      this.operationsResponse = operationsResponse;
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
  }
