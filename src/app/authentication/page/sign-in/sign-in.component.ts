import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { HttpErrorStatusHelper } from '../../../reusable/utils/http-error-status-helper';
import { AuthenticationEndpoints } from '../../authentication.module';
import { SignIn } from '../../dto/sign-in';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  formGroup = new FormGroup({
    login: new FormControl(undefined, Validators.required),
    password: new FormControl(undefined, Validators.required),
  });

  constructor(private readonly http: HttpClient, private readonly authService: AuthenticationService, private readonly router: Router) {}

  signIn(): void {
    if (this.formGroup.valid) {
      const login = this.formGroup.get('login')?.value;
      const password = this.formGroup.get('password')?.value;
      if (login && password) {
        this.http
          .post<{ token: string }>(AuthenticationEndpoints.SIGN_IN, {
            username: login,
            password,
          } as SignIn)
          .pipe(take(1))
          .subscribe(
            (jwt: { token: string }) => {
              this.formGroup.setErrors(null);
              this.authService.storeJWT(jwt.token);
              void this.router.navigateByUrl('/');
            },
            (error: HttpErrorResponse) => {
              if (HttpErrorStatusHelper.UNAUTHORIZED(error)) {
                this.formGroup.setErrors({ unauthorized: true });
              }
            },
          );
      }
    }
  }
}
