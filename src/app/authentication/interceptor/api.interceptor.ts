import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BusinessUtils } from '../../business/utils/business-utils';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('i18n')) {
      return next.handle(request);
    }
    const businessId = BusinessUtils.GET_ID();
    const apiReq = request.clone({
      url: `${environment.baseUrl}/${request.url}`,
      headers: request.headers.set('businessId', businessId!.toString()),
      withCredentials: true,
    });
    return next.handle(apiReq);
  }
}
