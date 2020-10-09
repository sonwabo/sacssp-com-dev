import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [{
  path: '',
  component: UserManagementComponent,
}];

export const userManagementRouting = RouterModule.forChild(routes);