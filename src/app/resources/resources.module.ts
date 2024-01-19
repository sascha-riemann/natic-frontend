import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';

import { DialogResourceCategoryFormComponent } from './dialog/dialog-resource-category-form/dialog-resource-category-form.component';
import { DialogResourceFormComponent } from './dialog/dialog-resource-form/dialog-resource-form.component';

export class ResourceEndpoints {
  static GET = 'resources';
  static POST = 'resources';
  static CATEGORY_CREATE = 'resources/category';
  static CATEGORY_UPDATE = (resourceCategoryId: number) => `resources/category/${resourceCategoryId}`;
  static UPDATE = (resourceId: number) => `resources/${resourceId}`;
  static DELETE = (resourceId: number) => `resources/${resourceId}`;
  static CATEGORY_DELETE = (resourceCategoryId: number) => `resources/category/${resourceCategoryId}`;
}

@NgModule({
  declarations: [DialogResourceFormComponent, DialogResourceCategoryFormComponent],
  imports: [CommonModule, ButtonModule, DropdownModule, InputTextModule, PaginatorModule, ReactiveFormsModule, TooltipModule],
  exports: [DialogResourceFormComponent],
})
export class ResourcesModule {}
