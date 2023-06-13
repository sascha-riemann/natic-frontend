import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { HttpErrorStatusHelper, NaticHttpErrorResponse } from '../../../reusable/utils/http-error-status-helper';
import { AuthenticationEndpoints } from '../../authentication.module';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  formGroup = new FormGroup(
    {
      firstName: new FormControl(undefined, Validators.required),
      lastName: new FormControl(undefined, Validators.required),
      username: new FormControl(undefined, Validators.required),
      email: new FormControl(undefined, Validators.required),
      phone: new FormControl(undefined, Validators.required),
      password: new FormControl(undefined, Validators.required),
      passwordRepeat: new FormControl(undefined, Validators.required),
    },
    () => {
      return (formGroup: FormGroup) => {
        const password = formGroup.get('password');
        const passwordRepeat = formGroup.get('passwordRepeat');

        if (password?.value !== passwordRepeat?.value) {
          password?.setErrors({ required: true });
          passwordRepeat?.setErrors({ required: true });
        } else {
          password?.setErrors(null);
          passwordRepeat?.setErrors(null);
        }
        return;
      };
    },
  );

  constructor(private readonly http: HttpClient, private readonly authService: AuthenticationService, private readonly router: Router) {}

  signUp(): void {
    if (this.formGroup.valid) {
      this.http
        .post<{ token: string }>(AuthenticationEndpoints.SIGN_UP, this.formGroup.value)
        .pipe(take(1))
        .subscribe(
          jwt => {
            this.formGroup.setErrors(null);
            this.authService.storeJWT(jwt.token);
            void this.router.navigateByUrl('/');
          },
          (error: HttpErrorResponse) => {
            this.formGroup.setErrors(null);
            const conflict = HttpErrorStatusHelper.CONFLICT(error);
            if (conflict) {
              const errorMessage = (error as NaticHttpErrorResponse).error.message;

              if (errorMessage === 'email') {
                this.formGroup.setErrors({ emailInUse: true });
              } else if (errorMessage === 'username') {
                this.formGroup.setErrors({ usernameInUse: true });
              }
            }
          },
        );
    }
  }
}
