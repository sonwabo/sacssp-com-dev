import { Injectable } from '@angular/core';
import {NbAuthService, decodeJwtPayload, NbAuthJWTToken} from '@nebular/auth';
import {Document} from "@app/jbpm/domain/document";
import {Observable} from "rxjs";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class JWTTokenService {

  jwtTokenString: string = null;
  decodedToken: any = null; // {[key: string]: string};

  constructor(private authService: NbAuthService, private http: HttpClient) {
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

  getPayload(): void {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

      });
  }

  getDecodedToken(): any {
    return decodeJwtPayload(this.jwtTokenString);
  }


  guestCreadentials(): Observable<any> {
    const url = `${environment.baseBackEnd}/v1/authenticate`;
    return this.http.post<any[]>(url , {username: environment.guestusername, password: environment.guestpassword});
  }

}
