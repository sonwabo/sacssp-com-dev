

export const scheme_management_table_settings: any =  {
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
      title: 'Scheme Name',
      type: 'string',
    },
    description: {
      title: 'Description',
      type: 'string',
    },
  },
};
