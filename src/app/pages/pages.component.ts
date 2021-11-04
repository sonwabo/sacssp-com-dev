import {Component, OnDestroy, OnInit} from '@angular/core';

import {MENU_ITEMS} from './pages-menu';
import {UserRoles} from '../../app/authentication/model/user-roles';
import { JWTTokenService } from '../jbpm/service/JWTTokenService';
import { UserDetails } from '../authentication/model/user.details';
import {WindowsDialogComponent} from '@app/jbpm/common-component/window-dialog/window-dialog.component';
import {NbWindowService} from '@nebular/theme';
import {Router} from '@angular/router';
import {NbAuthJWTToken} from "@nebular/auth";

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
<!--      <nb-menu [items]="menu" (click)="test($event)"></nb-menu>-->

      <nb-card [size]="'tiny'">
        <nb-card-body>
          <nb-list>
            <nb-list-item *ngFor="let fruit of fruits">
              {{ fruit }}
            </nb-list-item>
          </nb-list>
        </nb-card-body>
      </nb-card>

      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {

  menu: any;
  readonly editprofile = 'Edit User Profile';
  readonly fruits: Array<string> = ['Apple', 'Banana', 'Carrots', 'Orange'];


  constructor(private jwtTokenService: JWTTokenService,
              private windowService: NbWindowService, private router: Router) {
     UserDetails.tokenObject = 'testing'; //this.jwtTokenService

    console.log('<<<<<<<<<, This Pages  >>>>>>>>');
     jwtTokenService.getPayload();

  }

  ngOnInit() {
    const _tempMenu = [...MENU_ITEMS];
    //_tempMenu.forEach(value => {
    //   const opsUser = (UserDetails.getRoles().includes(UserRoles.FUND_ADMIN_OR_COORDINATOR_ROLE));
    //   if (!opsUser) {
    //     if (value.title.trim() !== 'My Tasks') {
    //       value.hidden = true;
    //     }
    //   } else {
    //     value.hidden = false;
    //   }
    // });
    this.menu = _tempMenu;
  }

  test(event: any): void {
    if (this.editprofile === event.srcElement.innerHTML) {
      this.router.navigate(['pages/jbpm/divisions']);
      this.windowService.open(WindowsDialogComponent, {
        context: {
          title: 'Search For User',
          message: `User Data has been Created Successfully, User Reference has been generated
         ,also an email with the generated reference has been sent to your email`,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.menu = null;
  }
}
