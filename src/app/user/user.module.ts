import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageComponent } from '../reusable/page/page/page.component';
import { UserComponent } from './page/user/user.component';

export class UserEndpoints {
  static getUser = (id: number) => `user/${id}`;
  static getUsers = 'user';
  static createUser = 'user';
  static updateUser = (userId: number) => `user/${userId}`;
  static removeFromBusiness = (userId: number) => `business/users/${userId}`;
}

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, PageComponent],
})
export class UserModule {}
