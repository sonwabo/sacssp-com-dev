import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import {AuthGuard} from './authentication/auth-guard/auth-guard.service';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'verify',
    loadChildren: () => import('./authentication/auth.module')
      .then(m => m.NgxAuthModule),
  },

  { path: '', redirectTo: 'verify/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'verify/login' },

];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
