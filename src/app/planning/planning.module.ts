import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'angular-calendar';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule as PrimeCalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { ReusableModule } from '../reusable/reusable.module';
import { PlanningPageCreateProjectComponent } from './component/planning-page-create-project/planning-page-create-project.component';
import { PlanningComponent } from './page/planning/planning.component';
import { DialogPlanningProjectSelectionComponent } from './dialog/dialog-planning-project-selection/dialog-planning-project-selection.component';
import {PickListModule} from "primeng/picklist";
import {TagModule} from "primeng/tag";
import {PageComponent} from "../reusable/page/page/page.component";

const ROUTES: Routes = [
  {
    path: '',
    component: PlanningComponent,
  },
  {
    path: ':start/:end',
    component: PlanningComponent,
  },
  {
    path: ':start/:end/:visibleDays',
    component: PlanningComponent,
  },
];

export class PlanningEndpoints {
  static GET = (orgId: number, start: Date, end: Date) => `planning/${orgId}/${start.toDateString()}/${end.toDateString()}/`;
  static CREATE = (date: Date, projectId: number) => `planning/${date.toDateString()}/${projectId}`;
  static DELETE = (planningId: number) => `planning/${planningId}`;
  static USER_ADD = (planningId: number, userId: number) => `planning/${planningId}/user/${userId}`;
  static USER_DELETE = (planningId: number, userId: number) => `planning/${planningId}/user/${userId}`;
  static RESOURCE_ADD = (planningId: number, resourceId: number) => `planning/${planningId}/resource/${resourceId}`;
  static RESOURCE_DELETE = (planningId: number, resourceId: number) => `planning/${planningId}/resource/${resourceId}`;
}

@NgModule({
  declarations: [PlanningComponent, PlanningPageCreateProjectComponent, DialogPlanningProjectSelectionComponent],
    imports: [
        RouterModule.forChild(ROUTES),
        ReusableModule,
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
        PrimeCalendarModule,
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
        AccordionModule,
        DialogModule,
        InputTextareaModule,
        PickListModule,
        TagModule,
        PageComponent,
    ],
  providers: [DialogService],
})
export class PlanningModule {}
