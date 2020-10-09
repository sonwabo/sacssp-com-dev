import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceProviderNetworksComponent } from './service-provider-networks.component';

const routes: Routes = [{
  path: '',
  component:  ServiceProviderNetworksComponent,
}];

export const serviceProviderNetworksRouting = RouterModule.forChild(routes);