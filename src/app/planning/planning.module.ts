import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'angular-calendar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule as PrimeCalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { ReusableModule } from '../reusable/reusable.module';
import { PlanningComponent } from './planning/planning.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PlanningComponent,
  },
];

export class PlanningEndpoints {
  static GET = (orgId: number, start: Date, end: Date) => `planning/${orgId}/${start.toDateString()}/${end.toDateString()}/`;
  static CREATE = (date: Date, projectId: number) => `planning/${date.toDateString()}/${projectId}`;
  static DELETE = (planningId: number) => `planning/${planningId}`;
  static USER_ADD = (planningId: number, userId: number) => `planning/${planningId}/staff/${userId}`;
  static USER_DELETE = (planningId: number, userId: number) => `planning/${planningId}/staff/${userId}`;
}

@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    PrimeCalendarModule,
    ReusableModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    PanelModule,
    DividerModule,
    MultiSelectModule,
    ListboxModule,
    FormsModule,
    RippleModule,
    ChipModule,
    CardModule,
    TooltipModule,
    ChipsModule,
    CheckboxModule,
  ],
})
export class PlanningModule {}
