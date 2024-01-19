import { NgIf } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';

import { ReusableModule } from '../../reusable.module';

export interface UserForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  passwordRepeat?: string;
  changeOwn: boolean;
}

export type UserFormError = 'usernameExist' | 'emailExist';

@UntilDestroy()
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [InputTextModule, MessageModule, NgIf, PaginatorModule, ReactiveFormsModule, ReusableModule, ButtonModule, RouterLink],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true,
    },
  ],
})
export class UserFormComponent implements ControlValueAccessor {
  private _changeOwn = false;

  get changeOwn(): boolean {
    return this._changeOwn;
  }

  @Input() set changeOwn(changeOwn: boolean) {
    this._changeOwn = changeOwn;

    const additionalFormControls = this.changeOwn
      ? {
          password: new FormControl<string | undefined>(undefined, Validators.required),
          passwordRepeat: new FormControl<string | undefined>(undefined, Validators.required),
        }
      : {};

    const formGroup = this.formBuilder.group({
      firstName: new FormControl<string | undefined>(undefined, Validators.required),
      lastName: new FormControl<string | undefined>(undefined, Validators.required),
      username: new FormControl<string | undefined>(undefined, Validators.required),
      email: new FormControl<string | undefined>(undefined, Validators.required),
      ...additionalFormControls,
    });

    if (this.changeOwn) {
      formGroup.addValidators(UserFormComponent.passwordRepeatValidator('password', 'passwordRepeat'));
    }

    this.formGroup = formGroup;

    this.formGroup?.valueChanges.pipe(untilDestroyed(this)).subscribe(userForm => {
      if (this.formGroup?.valid) {
        this.onChange?.(userForm as UserForm);
        this.onTouch?.(userForm as UserForm);
      } else {
        this.onChange?.(null);
        this.onTouch?.(null);
      }
    });
  }

  formGroup?: FormGroup;

  private static passwordRepeatValidator(passwordControlName1: string, passwordControlName2: string): ValidatorFn {
    return (control: AbstractControl) => {
      const group = control as FormGroup;
      const password = group.get(passwordControlName1);
      const passwordRepeat = group.get(passwordControlName2);
      if (password?.value !== passwordRepeat?.value) {
        passwordRepeat?.setErrors({ notEqual: true });
      } else {
        passwordRepeat?.setErrors(null);
      }
      return null;
    };
  }

  onChange?: (userForm: UserForm | null) => void;
  onTouch?: (userForm: UserForm | null) => void;

  @Input() set setError(error: undefined | UserFormError) {
    this.formGroup?.markAllAsTouched();
    this.formGroup?.setErrors(null);

    if (error && error === 'usernameExist') {
      this.formGroup?.get('username')?.setErrors({ exists: true });
    }

    if (error && error === 'emailExist') {
      this.formGroup?.get('email')?.setErrors({ exists: true });
    }
  }

  constructor(private readonly formBuilder: FormBuilder) {}

  registerOnChange(fn: (userForm: UserForm | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (userForm: UserForm | null) => void): void {
    this.onTouch = fn;
  }

  writeValue(userForm?: UserForm): void {
    if (userForm) {
      this.formGroup?.patchValue({
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        username: userForm.username,
        email: userForm.email,
      });
    }
  }
}
