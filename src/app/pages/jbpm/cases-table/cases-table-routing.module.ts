import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CasesTableComponent } from './cases-table.component';

const routes: Routes = [{
  path: '',
  component: CasesTableComponent,
}];

export const casesTableRouting = RouterModule.forChild(routes);