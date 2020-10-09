import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JbpmComponent } from './jbpm.component';
import { TaskCommentsComponent } from './task-comments/task-comments.component';
import {DocumentRenderComponent} from './blocks/document-render.component';
import { APP_ROUTES } from './utils/routes-list-enum';

const routes: Routes = [{
  path: '',
  component: JbpmComponent,
  children: [
    {
      path:APP_ROUTES.DIVISIONS,
      loadChildren: () => import('./divisions/division.module')
        .then(m => m.divisionModule),
    },
    {
      path:APP_ROUTES.SCHEMES,
      loadChildren: () => import('./schemes/scheme.module')
        .then(m => m.schemeModule),
    },
    {
      path:APP_ROUTES.CASES_TABLES,
      loadChildren: () => import('./cases-table/cases-table.module')
        .then(m => m.casesTableModule),
    },
    {
      path:APP_ROUTES.CASE_DETAIL,
      loadChildren: () => import('./case-detail/case-detail.module')
        .then(m => m.casesDetailModule),
    },
    {
      path:APP_ROUTES.USER_MANAGEMENT,
      loadChildren: () => import('./users/user-management.module')
        .then(m => m.userManagementModule),
    },
    {
      path:APP_ROUTES.SCHEME_OFFICIALS,
      loadChildren: () => import('./scheme-officials/scheme-officials.module')
        .then(m => m.schemeOfficialsModule),
    },
    {
      path:APP_ROUTES.OPERATIONS_DEPARTMENT,
      loadChildren: () => import('./operations-departments/operations-department..module')
        .then(m => m.operationsDepartmentModule),
    },
    {
      path:APP_ROUTES.FUND_MANAGEMENT_DEPARTMENT,
      loadChildren: () => import('./fund-management-departments/fund-management-department.module')
        .then(m => m.fundManagementDepartmentModule),
    },
    {
      path:APP_ROUTES.SERVICE_PROVIDER_NETWORKS,
      loadChildren: () => import('./service-provider-networks/service-provider-networks.module')
        .then(m => m.serviceProviderNetworksModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JbpmRoutingModule { }

export const routedComponents = [
  JbpmComponent,
  DocumentRenderComponent,
  TaskCommentsComponent,
];
