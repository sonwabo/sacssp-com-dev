import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsDepartmentComponent } from './operations-department.component';

const routes: Routes = [{
  path: '',
  component: OperationsDepartmentComponent,
}];

export const operationsDepartmentRouting = RouterModule.forChild(routes);