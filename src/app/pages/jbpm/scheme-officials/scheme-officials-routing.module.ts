import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';;
import { SchemeOfficialsComponent } from './scheme-officials.component';

const routes: Routes = [{
  path: '',
  component: SchemeOfficialsComponent,
}];

export const schemeOfficialsRouting = RouterModule.forChild(routes);