import {Component} from '@angular/core';
import {getDeepFromObject, NbAuthResult, NbLoginComponent} from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {

  login() {

    console.log('Email', this.user.username );
    console.log('Password', this.user.password );
    super.login();
  }


  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}

