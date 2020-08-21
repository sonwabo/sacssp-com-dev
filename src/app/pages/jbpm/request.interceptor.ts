import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {environment} from "../../../environments/environment";

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

  //NOTE: I'll set this up on I have the log in page up and running
  private getHeaders(): HttpHeaders {
    const headerStr = `Basic ` + btoa(`${environment.username}:${environment.password}`);
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: headerStr

    });
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
