import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { ReusableModule } from '../reusable/reusable.module';
import { BusinessCreateComponent } from './page/business-create/business-create.component';
import { BusinessSelectComponent } from './page/business-select/business-select.component';
import { BusinessUsersComponent } from './page/business-staff/business-users.component';

export class BusinessEndpoints {
  static GET = 'business';
  static CREATE = 'business';
  static ADD_USER = 'business/user/add';
  static USERS = (businessId: number) => `business/${businessId}/users`;
}

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'select',
  },
  {
    path: 'select',
    component: BusinessSelectComponent,
  },
  {
    path: 'create',
    component: BusinessCreateComponent,
  },
  {
    path: 'users',
    component: BusinessUsersComponent,
  },
];

@NgModule({
  declarations: [BusinessSelectComponent, BusinessCreateComponent, BusinessUsersComponent],
  imports: [
    CommonModule,
    ReusableModule,
    OrderListModule,
    ListboxModule,
    ButtonModule,
    RouterLink,
    RouterModule.forChild(ROUTES),
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
    TooltipModule,
  ],
})
export class BusinessModule {}
