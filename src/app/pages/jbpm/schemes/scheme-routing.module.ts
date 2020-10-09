import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchemeComponent } from './scheme.component';

const routes: Routes = [{
  path: '',
  component: SchemeComponent,
}];

export const schemeRouting = RouterModule.forChild(routes);