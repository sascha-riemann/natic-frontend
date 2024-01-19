import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';

import { ReusableModule } from '../reusable/reusable.module';
import { RoleComponent } from './page/role/role.component';
import { RolesComponent } from './page/roles/roles.component';
import {PickListModule} from "primeng/picklist";
import {PageComponent} from "../reusable/page/page/page.component";

export class RoleEndpoints {
  static list = 'roles';
  static getById = (id: number) => `roles/${id}`;
  static update = (id: number) => `roles/${id}`;
  static create = 'roles';
}

const ROUTES: Routes = [
  {
    path: '',
    component: RolesComponent,
  },
  {
    path: 'create',
    component: RoleComponent,
  },
  {
    path: ':id',
    component: RoleComponent,
  },
];

@NgModule({
  declarations: [RoleComponent, RolesComponent],
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        SelectButtonModule,
        RouterModule.forChild(ROUTES),
        ButtonModule,
        TableModule,
        ReusableModule,
        ListboxModule,
        PickListModule,
        PageComponent,
    ],
})
export class RoleModule {}
