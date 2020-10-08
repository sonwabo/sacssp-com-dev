import {EpochDateRenderComponent} from '../blocks/epoch-date-render.component';
import {CaseStatusRenderComponent} from '../blocks/case-status-render.component';
import {SlaComplianceRenderComponent} from '../blocks/sla-compliance-render.component';


export const case_table_settings: any = {
  mode: 'external',
  actions: {
    add: false,
    edit: true,
    delete: false,
    position: 'right',
  },
  add: {
    addButtonContent: '<i class="nb-plus"></i>',
    confirmCreate: false,
  },
  edit: {
    editButtonContent: '<i class="nb-edit"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
    confirmSave: true,
  },
  columns: {
    'case-id': {
      title: 'Case ID',
    },
    'case-status': {
      title: 'Status',
      type: 'custom',
      renderComponent: CaseStatusRenderComponent,
    },
    'case-sla-compliance': {
      title: 'SLA',
      type: 'custom',
      renderComponent: SlaComplianceRenderComponent,
    },
    'case-started-at': {
      title: 'Created',
      type: 'custom',
      renderComponent: EpochDateRenderComponent,
    },
    'case-sla-due-date': {
      title: 'Due',
      type: 'custom',
      renderComponent: EpochDateRenderComponent,
    },

    'received-from': {
      title: 'Received From',
    },
    'email-subject': {
      title: 'Subject',
    },
    'fund-administrator': {
      title: 'Fund Admin/Coordinator',
    },
    'operations-user': {
      title: 'Operations',
    },
  },
};

export const task_table_settings: any = {
  mode: 'external',
  actions: {
    add: false,
    edit: true,
    delete: false,
    position: 'right',
  },
  add: {
    addButtonContent: '<i class="nb-plus"></i>',
    confirmCreate: true,
  },
  edit: {
    editButtonContent: '<i class="nb-edit"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
    confirmSave: true,
  },
  columns: {
    'task-id': {
      title: 'ID',
    },
    'task-name': {
      title: 'Task Name',
    },
    'task-description': {
      title: 'Description',
    },
    'task-status': {
      title: 'Status',
    },
    'task-subject': {
      title: 'Subject',
    },
    'task-created-on': {
      title: 'Created',
      type: 'custom',
      renderComponent: EpochDateRenderComponent,
    },
  },
};
