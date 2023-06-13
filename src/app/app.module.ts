import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { TieredMenuModule } from 'primeng/tieredmenu';

import { AppComponent } from './app.component';
import { AuthGuard } from './authentication/guard/auth.guard';
import { ApiInterceptor } from './authentication/interceptor/api.interceptor';
import {BusinessGuard} from "./business/guard/business.guard";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

/**
 *
 * @param http
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/app/', '.json');
}

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then(m => m.StartModule),
    canActivate: [AuthGuard, BusinessGuard],
  },
  {
    path: 'planning',
    loadChildren: () => import('./planning/planning.module').then(m => m.PlanningModule),
    canActivate: [AuthGuard, BusinessGuard],
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
    canActivate: [AuthGuard, BusinessGuard],
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
  },
];

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MenubarModule,
    InputTextModule,
    AvatarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
      defaultLanguage: 'de',
    }),
    RippleModule,
    TieredMenuModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
