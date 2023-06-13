import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartComponent } from './start/start.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StartComponent,
  },
];

@NgModule({
  declarations: [StartComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
})
export class StartModule {}
