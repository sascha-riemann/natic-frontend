import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { AuthenticationService } from '../../../authentication/service/authentication.service';
import { UserForm, UserFormError } from '../../../reusable/component/user-form/user-form.component';
import { HttpErrorStatusHelper, NaticHttpErrorResponse } from '../../../reusable/utils/http-error-status-helper';
import { UpdateUser } from '../../../user/dto/user';
import { UserService } from '../../../user/service/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent {
  user = new FormControl<UserForm | undefined>(undefined, Validators.required);

  error?: UserFormError;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
  ) {}

  save(): void {
    if (this.user.valid) {
      const userFormValue = this.user.value;
      if (userFormValue) {
        this.userService
          .update({
            password: userFormValue.password,
            firstName: userFormValue.firstName,
            lastName: userFormValue.lastName,
            username: userFormValue.username,
            email: userFormValue.email,
          } as UpdateUser)
          .pipe(take(1))
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
