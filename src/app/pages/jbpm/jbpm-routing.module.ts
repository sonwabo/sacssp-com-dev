import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JbpmComponent } from './jbpm.component';
import { CasesTableComponent } from './cases-table/cases-table.component';
import { CaseDetailComponent } from './case-detail/case-detail.component';
import { TaskCommentsComponent } from './task-comments/task-comments.component';
import { CaseFileComponent } from './case-file/case-file.component';
import {CaseDocumentComponent} from './case-documents/case-document.component';
import {DocumentRenderComponent} from './blocks/document-render.component';
import {TestSearchComponent} from './utils/test-search.component';
import {UserManagementComponent} from './users/user-management.component';
import {SchemeOfficialsComponent} from './scheme-officials/scheme-officials.component';
import { APP_ROUTES } from './utils/routes-list-enum';
import {DivisionComponent} from './divisions/division.component';
import {SchemeComponent} from './schemes/scheme.component';

const routes: Routes = [{
  path: '',
  component: JbpmComponent,
  children: [
    {
      path: APP_ROUTES.CASES_TABLES,
      component: CasesTableComponent,
    },
    {
      path: APP_ROUTES.CASE_DETAIL,
      component: CaseDetailComponent,
    },
    {
      path: APP_ROUTES.USER_MANAGEMENT,
      component: UserManagementComponent,
    },
    {
      path: APP_ROUTES.SCHEME_OFFICIALS,
      component: SchemeOfficialsComponent,
    },
    {
      path: APP_ROUTES.DIVISIONS,
      component: DivisionComponent,
    },
    {
      path: APP_ROUTES.SCHEMES,
      component: SchemeComponent,
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
  CasesTableComponent,
  CaseDetailComponent,
  DocumentRenderComponent,
  CaseFileComponent,
  TaskCommentsComponent,
  CaseDocumentComponent,
  TestSearchComponent,
  UserManagementComponent,
  SchemeOfficialsComponent,
  DivisionComponent,
  SchemeComponent,
];
