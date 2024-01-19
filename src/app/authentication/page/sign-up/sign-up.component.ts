import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs';

import { UserForm, UserFormError } from '../../../reusable/component/user-form/user-form.component';
import { HttpErrorStatusHelper, NaticHttpErrorResponse } from '../../../reusable/utils/http-error-status-helper';
import { CreateUser } from '../../../user/dto/user';
import { UserService } from '../../../user/service/user.service';
import { SignIn } from '../../dto/sign-in';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  user = new FormControl<UserForm | undefined>(undefined, Validators.required);

  error?: UserFormError;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  onCancel(): void {
    void this.router.navigate(['../sign-in']);
  }

  save(): void {
    if (this.user.valid) {
      const userFormValue = this.user.value;
      if (userFormValue) {
        this.userService
          .create({
            password: userFormValue.password,
            firstName: userFormValue.firstName,
            lastName: userFormValue.lastName,
            username: userFormValue.username,
            email: userFormValue.email,
          } as CreateUser)
          .pipe(
            switchMap(() =>
              this.authenticationService.signIn({
                username: userFormValue.username,
                password: userFormValue.password,
              } as SignIn),
            ),
            take(1),
          )
          .subscribe(
            () => void this.router.navigateByUrl('/'),
            (error: HttpErrorResponse) => {
              const conflict = HttpErrorStatusHelper.CONFLICT(error);
              if (conflict) {
                const errorMessage = (error as NaticHttpErrorResponse).error.message;

                if (errorMessage === 'email') {
                  this.error = 'emailExist';
                } else if (errorMessage === 'username') {
                  this.error = 'usernameExist';
                }
              }
            },
          );
      }
    }
  }
}
