import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import { BusinessUtils } from '../../../business/utils/business-utils';
import { HttpErrorStatusHelper, NaticHttpErrorResponse } from '../../../reusable/utils/http-error-status-helper';
import { UpdateUser, User } from '../../dto/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-dialog-user-form',
  templateUrl: './dialog-user-form.component.html',
  styleUrls: ['./dialog-user-form.component.scss'],
})
export class DialogUserFormComponent {
  user?: User;

  formGroup = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    username: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, Validators.required),
    workTimePerDay: new FormControl<number | undefined>(undefined),
  });

  constructor(
    private readonly userService: UserService,
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
  ) {
    const user = config.data as User;
    if (user) {
      this.user = user;
      this.formGroup.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        workTimePerDay: user.workTimePerDay,
      });
    }
  }

  cancel(): void {
    this.ref.close();
  }

  save(): void {
    if (!BusinessUtils.GET_ID()) {
      return;
    }

    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      const user = {
        firstName: value!.firstName,
        lastName: value!.lastName,
        email: value!.email,
        username: value!.username,
        workTimePerDay: value!.workTimePerDay,
      } as User;

      if (this.user) {
        this.userService
          .update({
            ...user,
            id: this.user.id,
          } as UpdateUser)
          .pipe(take(1))
          .subscribe(
            () => {
              this.formGroup.reset();
              this.ref?.close(true);
            },
            (error: HttpErrorResponse) => this.handleError(error),
          );
      } else {
        this.userService
          .create(user)
          .pipe(take(1))
          .subscribe(
            () => {
              this.formGroup.reset();
              this.ref?.close(true);
            },
            (error: HttpErrorResponse) => this.handleError(error),
          );
      }
    }
  }

  handleError(error: HttpErrorResponse): void {
    this.formGroup.setErrors(null);
    const conflict = HttpErrorStatusHelper.CONFLICT(error);
    if (conflict) {
      const errorMessage = (error as NaticHttpErrorResponse).error.message;

      if (errorMessage === 'email') {
        this.formGroup.get('email')?.setErrors({ exists: true });
      } else if (errorMessage === 'username') {
        this.formGroup.get('username')?.setErrors({ exists: true });
      }
    }
  }
}
