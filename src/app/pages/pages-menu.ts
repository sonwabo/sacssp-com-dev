import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'Welcome',
    link: '/pages/jbpm/divisions',
    home: true,
  },
  {
    title: 'All Users',
    link: '/pages/jbpm/cases-table',
  },
  {
    title: 'Create user Profile',
    link: '/pages/jbpm/case-detail',
  },
  {
    title: 'Edit User Profile',
  },

  // {
  //   title: 'CONFIGURATION',
  //   group: true,
  // },
  // {
  //   title: 'System',
  //   icon: 'layout-outline',
  //   children: [
  //     {
  //       title: 'System',
  //       link: '/pages/tables/smart-table',
  //     },
  //     {
  //       title: 'Notifications',
  //       link: '/pages/tables/smart-table',
  //     },
  //     {
  //       title: 'SLA',
  //       link: '/pages/tables/smart-table',
  //     },
  //   ],
  // },
];
