import {Component, OnDestroy, OnInit} from '@angular/core';

import {MENU_ITEMS} from './pages-menu';
import {UserDetails} from '@app/authentication/model/user.details';
import {JWTTokenService} from '@app/jbpm/service/JWTTokenService';
import {UserRoles} from '../../app/authentication/model/user-roles';

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
export class PagesComponent implements OnInit, OnDestroy {

  menu: any;

  constructor(private jwtTokenService: JWTTokenService) {
    UserDetails.tokenObject = this.jwtTokenService
      .refreshToken()
      .getDecodedToken();
  }

  ngOnInit() {
    const _tempMenu = [...MENU_ITEMS];
    _tempMenu.forEach(value => {
      const opsUser = (UserDetails.getRoles().includes(UserRoles.FUND_ADMIN_OR_COORDINATOR_ROLE));
      if (!opsUser) {
        if (value.title.trim() !== 'My Tasks') {
          value.hidden = true;
        }
      } else {
        value.hidden = false;
      }
    });
    this.menu = _tempMenu;
  }

  ngOnDestroy(): void {
    this.menu = null;
  }
}
