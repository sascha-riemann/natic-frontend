import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InputTextModule } from 'primeng/inputtext';

import { SignInComponent } from './page/sign-in/sign-in.component';
import { SignUpComponent } from './page/sign-up/sign-up.component';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";

/**
 *
 * @param http
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/authentication/', '.json');
}

export class AuthenticationEndpoints {
  static BASE = 'authentication';
  static SIGN_IN = `${AuthenticationEndpoints.BASE}/sign-in`;
  static SIGN_UP = `${AuthenticationEndpoints.BASE}/sign-up`;
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
];

@NgModule({
  declarations: [SignUpComponent, SignInComponent],
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
  ],
})
export class AuthenticationModule {}
