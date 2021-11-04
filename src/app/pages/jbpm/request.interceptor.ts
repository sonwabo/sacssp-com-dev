import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {NbAuthService} from '@nebular/auth';
import {switchMap} from 'rxjs/operators';
import {JWTTokenService} from '@app/jbpm/service/JWTTokenService';

@Injectable()
export class RequestInterceptor implements HttpInterceptor, OnInit, OnDestroy {

  private static authUrl: string = 'auth/realms';


  private destroy$: Subject<void> = new Subject<void>();

  constructor(private authService: NbAuthService, private jwtTnService: JWTTokenService ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('>>>>>>>>>>>>>>.. Request UR: <<<<<<<<<<<<< ');
    console.log(request.url);
   // if ( request.url.match(RequestInterceptor.authUrl) /* || request.url.match(RequestInterceptor.be) */) {
   //    return next.handle(request);
   // }
   /* return this.authService.isAuthenticatedOrRefresh()
      .pipe(
        switchMap(authenticated => {
          if (authenticated) {
            return this.authService.getToken().pipe(
              switchMap(token => {
                const JWT = `Bearer ${token.getValue()}`;
                request = request.clone({
                  setHeaders: {
                    'Authorization': JWT,
                    'Accept': 'application/json',
                  },
                });
                return next.handle(request);
              }),
            );
          } else {
            return next.handle(request);
          }
        }),
      );

    */

    //jwtTnService.guestCreadentials

    return next.handle(request);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
