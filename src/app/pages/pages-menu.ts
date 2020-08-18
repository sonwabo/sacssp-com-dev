import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'briefcase-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'My Cases',
    link: '/pages/jbpm/cases-table',
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
    ]
  },
  {
    title: 'Scheme Officials',
    link: '/pages/tables/smart-table',
  },

  {
    title: 'Divisions',
    link: '/pages/tables/smart-table',
  },
  {
    title: 'Categories',
    link: '/pages/tables/smart-table',
  },


];
