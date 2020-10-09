import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundManagementDepartmentComponent } from './fund-management-department.component';

const routes: Routes = [{
  path: '',
  component: FundManagementDepartmentComponent,
}];

export const fundManagementDepartmentRouting = RouterModule.forChild(routes);