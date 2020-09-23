import {ChangeDetectorRef, Component} from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import {UserDetails} from '../model/user.details';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {

  login() {
    this.user.name = this.user.email;
    super.login();
  }
}
