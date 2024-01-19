import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly authService: AuthenticationService) {}

  /**
   * Allows activation if the user is authenticated.
   * @returns True or a redirect url tree.
   */
  canActivate(): Observable<true | UrlTree> {
    return this.checkAuthentication();
  }

  /**
   * Allows activation if the user is authenticated.
   * @returns True or a redirect url tree.
   */
  canActivateChild(): Observable<true | UrlTree> {
    return this.checkAuthentication();
  }

  /**
   * Allows loading if the user is authenticated.
   * @returns True or a redirect url tree.
   */
  canLoad(): Observable<true | UrlTree> {
    return this.checkAuthentication();
  }

  private checkAuthentication(): Observable<true | UrlTree> {
    return this.authService.requestAuthenticationStatus$().pipe(
      map(authenticated => {
        if (!authenticated) {
          return this.router.parseUrl('/authentication');
        }
        return true;
      }),
    );
  }
}
