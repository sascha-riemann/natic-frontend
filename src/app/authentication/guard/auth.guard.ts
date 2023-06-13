import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.getJWT()) {
      return true;
    } else {
      void this.router.navigate(['/authentication']);
      return false;
    }
  }
}
