import {UserKindRenderComponent} from '../blocks/user-kind-render.component';

export const users_management_table_settings: any =  {
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
    name: {
      title: 'Name',
      type: 'string',
    },
    surname: {
      title: 'Surname',
      type: 'string',
    },
    email: {
      title: 'Email',
      type: 'string',
    },
    kind: {
      title: 'UserType',
      type: 'custom',
      renderComponent: UserKindRenderComponent,
    },
    division: {
      title: 'Division',
      type: 'string',
    },
    linkedFundAdmin: {
      title: 'Assigned FMT Member',
      type: 'string',
    },
  },
};
