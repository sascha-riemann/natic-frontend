import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { UserFormComponent } from '../reusable/component/user-form/user-form.component';
import { ReusableModule } from '../reusable/reusable.module';
import { SignInComponent } from './page/sign-in/sign-in.component';
import { SignOutComponent } from './page/sign-out/sign-out.component';
import { SignUpComponent } from './page/sign-up/sign-up.component';

/**
 *
 * @param http
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/authentication/', '.json');
}

export class AuthenticationEndpoints {
  static BASE = 'authentication';
  static CHECK = 'authentication/check';
  static CHECK_PERMISSION = 'authentication/check/role';
  static SIGN_IN = `${AuthenticationEndpoints.BASE}/sign-in`;
  static SIGN_UP = `${AuthenticationEndpoints.BASE}/sign-up`;
  static SIGN_OUT = `${AuthenticationEndpoints.BASE}/sign-out`;
}

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'logout',
    component: SignOutComponent,
  },
];

@NgModule({
  declarations: [SignUpComponent, SignInComponent, SignOutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
      defaultLanguage: 'de',
    }),
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    ReusableModule,
    MessageModule,
    UserFormComponent,
  ],
})
export class AuthenticationModule {}
