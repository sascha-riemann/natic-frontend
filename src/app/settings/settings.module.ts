import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { UserFormComponent } from '../reusable/component/user-form/user-form.component';
import { UserSettingsComponent } from './page/user-settings/user-settings.component';
import {PageComponent} from "../reusable/page/page/page.component";

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user',
  },
  {
    path: 'user',
    component: UserSettingsComponent,
  },
];

@NgModule({
  declarations: [UserSettingsComponent],
    imports: [CommonModule, RouterModule.forChild(ROUTES), UserFormComponent, ButtonModule, RouterLink, ReactiveFormsModule, PageComponent],
})
export class SettingsModule {}
