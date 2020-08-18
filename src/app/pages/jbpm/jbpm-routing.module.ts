import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JbpmComponent } from './jbpm.component';
import { CasesTableComponent } from './cases-table/cases-table.component';
import { CaseDetailComponent } from './case-detail/case-detail.component';

const routes: Routes = [{
  path: '',
  component: JbpmComponent,
  children: [
    {
      path: 'cases-table',
      component: CasesTableComponent,
    },
    {
      path: 'case-detail',
      component: CaseDetailComponent,
    }
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
];
