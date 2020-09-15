import { NbMenuItem } from '@nebular/theme';
import {UserDetails} from '../authentication/model/user.details';

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
    hidden: UserDetails.hideMenu.valueOf(),
  },
  {
    title: 'CONFIGURATION',
    group: true,
    hidden: UserDetails.hideMenu.valueOf(),
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
    hidden: UserDetails.hideMenu.valueOf(),
  },

  {
    title: 'User Management',
    link: '/pages/jbpm/user-management',
    hidden: UserDetails.hideMenu.valueOf(),
  },
  {
    title: 'Scheme Officials',
    link: '/pages/jbpm/scheme-officials',
    hidden: UserDetails.hideMenu.valueOf(),

  },
  {
    title: 'Divisions',
    link: '/pages/jbpm/divisions',
    hidden: UserDetails.hideMenu.valueOf(),

  },
  {
    title: 'Schemes',
    link: '/pages/jbpm/schemes',
    hidden: UserDetails.hideMenu.valueOf(),
  },
  {
    title: 'Categories',
    link: '/pages/tables/smart-table',
    hidden: UserDetails.hideMenu.valueOf(),
  },
];
