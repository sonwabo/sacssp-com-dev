import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor, OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
 

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({setHeaders : {
      'Authorization': 'Basic ZnVuZC1hZG1pbmlzdHJhdG9yOmp1bXBjbzIwMTc=',
      'Content-Type': 'application/json; charset=utf-8',
    }});

    return next.handle(request);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
