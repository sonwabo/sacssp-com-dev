import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DivisionComponent } from './division.component';

const routes: Routes = [{
  path: '',
  component: DivisionComponent,
}];

export const divisionRouting = RouterModule.forChild(routes);