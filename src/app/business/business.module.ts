import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MessageModule } from 'primeng/message';
import { OrderListModule } from 'primeng/orderlist';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { ResourcesModule } from '../resources/resources.module';
import { ReusableModule } from '../reusable/reusable.module';
import { DialogUserFormComponent } from '../user/dialog/dialog-user-form/dialog-user-form.component';
import { UsersComponent } from '../user/page/users/users.component';
import { BusinessCreateComponent } from './page/business-create/business-create.component';
import { BusinessResourcesComponent } from './page/business-resources/business-resources.component';
import { BusinessSelectComponent } from './page/business-select/business-select.component';
import {TagModule} from "primeng/tag";
import {PageComponent} from "../reusable/page/page/page.component";

export class BusinessEndpoints {
  static get = 'business';
  static create = 'business';
  static resources = 'business/resources';
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
    component: UsersComponent,
  },
  {
    path: 'resources',
    component: BusinessResourcesComponent,
  },
];

@NgModule({
  declarations: [BusinessSelectComponent, BusinessCreateComponent, UsersComponent, BusinessResourcesComponent, DialogUserFormComponent],
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
        TabViewModule,
        StyleClassModule,
        DataViewModule,
        DropdownModule,
        DialogModule,
        ChipsModule,
        ChipModule,
        CheckboxModule,
        FormsModule,
        ConfirmPopupModule,
        ToastModule,
        ConfirmDialogModule,
        ResourcesModule,
        MessageModule,
        CardModule,
        TagModule,
        PageComponent,
    ],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class BusinessModule {}
