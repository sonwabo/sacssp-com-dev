import {ChangeDetectorRef, Component} from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import {UserDetails} from '../model/user.details';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
  login() {
    UserDetails.owner = this.user.email;
    this.user.name = UserDetails.owner;
    super.login();
  }
}
