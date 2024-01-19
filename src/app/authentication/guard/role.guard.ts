import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(permissionKey: string, private readonly router: Router, private readonly authService: AuthenticationService) {}

  /**
   * Allows activation if the user is authenticated.
   * @returns True or a redirect url tree.
   */
  canActivate(): Observable<boolean> {
    return this.checkRole();
  }

  /**
   * Allows activation if the user is authenticated.
   * @returns True or a redirect url tree.
   */
  canActivateChild(): Observable<boolean> {
    return this.checkRole();
  }

  /**
   * Allows loading if the user is authenticated.
   * @returns True or a redirect url tree.
   */
  canLoad(): Observable<boolean> {
    return this.checkRole();
  }

  private checkRole(): Observable<boolean> {
    return this.authService.requestAuthenticationStatus$();
  }
}
