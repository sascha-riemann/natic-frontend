import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../service/authentication.service';
import {BusinessUtils} from "../../business/utils/business-utils";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('i18n')) {
      return next.handle(request);
    }
    const jwt = this.authenticationService.getJWT();
    const businessId = BusinessUtils.GET_ID();
    const apiReq = request.clone({
      url: `${environment.baseUrl}/${request.url}`,
      headers: request.headers.set('Authorization', `Bearer ${jwt}`).set('businessId', businessId!.toString()),
    });
    return next.handle(apiReq);
  }
}
