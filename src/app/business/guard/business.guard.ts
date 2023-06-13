import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { BusinessUtils } from '../utils/business-utils';

@Injectable({
  providedIn: 'root',
})
export class BusinessGuard implements CanActivate {
  constructor(private readonly router: Router) {}
  canActivate(): boolean {
    if (BusinessUtils.GET_ID()) {
      return true;
    } else {
      void this.router.navigate(['/business/select']);
      return false;
    }
  }
}
