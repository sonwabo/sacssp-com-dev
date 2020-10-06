import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {NbAuthService} from '@nebular/auth';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor, OnInit, OnDestroy {

  private static authUrl: string = 'auth/realms';


  private destroy$: Subject<void> = new Subject<void>();

  constructor(private authService: NbAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ( request.url.match(RequestInterceptor.authUrl) /* || request.url.match(RequestInterceptor.be) */) {
       return next.handle(request);
    }
    return this.authService.isAuthenticatedOrRefresh()
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
    request = request.clone({setHeaders : {
        'Authorization': 'Basic ZnVuZC1hZG1pbmlzdHJhdG9yOmp1bXBjbzIwMTc=',
    }});
    return next.handle(request);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
