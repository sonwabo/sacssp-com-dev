import {FormGroup} from "@angular/forms";

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
    DEMANOBJECTKEY = 'io.jumpco.metropolitan.requesttracker.Demand'
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
    OBSOLETE = 'Obsolete'
  }


  export enum TaskNames {
    FUND_MANAGEMENT_TASK = 'Fund Management Update Task',
    OPERATIONS_MANAGEMENT_TASK = 'Operations Update Task',
  }
