import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { BusinessUtils } from '../../../business/utils/business-utils';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
})
export class SignOutComponent {
  constructor(private readonly authService: AuthenticationService, private readonly location: Location, private readonly router: Router) {}

  logout(): void {
    this.authService
      .signOut()
      .pipe(take(1))
      .subscribe(() => {
        BusinessUtils.REMOVE();
        void this.router.navigateByUrl('/');
      });
  }

  cancel(): void {
    this.location.back();
  }
}
