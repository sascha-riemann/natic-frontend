import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { SignIn } from '../../dto/sign-in';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  formGroup = new FormGroup({
    username: new FormControl<string | undefined>(undefined, Validators.required),
    password: new FormControl<string | undefined>(undefined, Validators.required),
  });

  error = false;

  constructor(private readonly http: HttpClient, private readonly authService: AuthenticationService, private readonly router: Router) {}

  signIn(): void {
    if (this.formGroup.valid) {
      this.authService
        .signIn(this.formGroup.value as SignIn)
        .pipe(take(1))
        .subscribe(
          () => void this.router.navigateByUrl('/'),
          () => {
            this.formGroup.setErrors({ unauthorized: true });
          },
        );
    }
  }
}
