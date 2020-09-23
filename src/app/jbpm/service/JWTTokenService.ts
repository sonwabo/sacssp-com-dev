import { Injectable } from '@angular/core';
import {NbAuthService, decodeJwtPayload} from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class JWTTokenService {

  jwtTokenString: string = null;
  decodedToken: any = null; // {[key: string]: string};

  constructor(private authService: NbAuthService) {
  }

  refreshToken(): JWTTokenService {
    this.authService.getToken().subscribe(res => this.setToken(res.getPayload()['access_token']));
    return this;
  }

  setToken(token: string): JWTTokenService {
     this.jwtTokenString = null;
     if (token) {
       this.jwtTokenString = token;
     }
     return this;
  }

  decodeToken(): void {
    if (this.jwtTokenString) {
       this.decodedToken = decodeJwtPayload(this.jwtTokenString);
    }
  }

  getDecodedToken(): any {
    return decodeJwtPayload(this.jwtTokenString);
  }
}
