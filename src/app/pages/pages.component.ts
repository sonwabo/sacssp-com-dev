import {Component, OnInit} from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {UserDetails} from '../authentication/model/user.details';
import {NbAuthService} from '@nebular/auth';
import {tap} from 'rxjs/operators';
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = MENU_ITEMS;
  constructor(private authService: NbAuthService) {
    this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.menu = new Array();
          } else {
            for ( const item of this.menu ) {
              (item as NbMenuItem).hidden = (UserDetails.owner === 'operations_sme');
            }
          }
        }),
      );
  }
  ngOnInit() { console.error( '<<<< Menu Items >>>>' + this.menu ); }
}
