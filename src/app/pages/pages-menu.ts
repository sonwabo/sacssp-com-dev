import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Dashboard',
  //   icon: 'briefcase-outline',
  //   link: '/pages/dashboard',
  //   home: false,
  //   hidden: true,
  // },
  {
    title: 'My Tasks',
    link: '/pages/jbpm/cases-table',
    home: true,
  },
  {
    title: 'Cases',
    link: '/pages/jbpm/cases-table',
  },
  {
    title: 'CONFIGURATION',
    group: true,
  },
  {
    title: 'System',
    icon: 'layout-outline',
    children: [
      {
        title: 'System',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Notifications',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'SLA',
        link: '/pages/tables/smart-table',
      },
    ],
  },

  {
    title: 'User Management',
    link: '/pages/jbpm/user-management',
  },
  {
    title: 'Scheme Officials',
    link: '/pages/jbpm/scheme-officials',
  },
  {
    title: 'Divisions',
    link: '/pages/jbpm/divisions',
  },
  {
    title: 'Schemes',
    link: '/pages/jbpm/schemes',
  },
  {
    title: 'Operations Departments',
    link: '/pages/jbpm/operations-departments',
  },
  {
    title: 'Fund Management Departments',
    link: '/pages/jbpm/fund-management-departments',
  },
  {
    title: 'Service Provider Networks',
    link: '/pages/jbpm/service-provider-networks',
  },
];
