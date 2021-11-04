export const case_table_settings: any = {
  mode: 'external',
  actions: {
    add: false,
    edit: true,
    delete: false,
    position: 'right',
    columnTitle : 'Edit',

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
    'name1': {
      title: 'First-Name',
    },
    'surname': {
      title: 'Surname',
    },
    'gender': {
      title: 'Gender',
    },
    'language': {
      title: 'Language',
    },
    'birthdate': {
      title: 'Birth Date',
    },
    'idnumber': {
      title: 'Identification Number',
    },
    'passport': {
      title : 'Passport',
    },
    'ethnicalstatus': {
      title: 'Ethnical Status',
    },
    'cellphone': {
      title: 'Primary Contact Number',
    },
  },
};
