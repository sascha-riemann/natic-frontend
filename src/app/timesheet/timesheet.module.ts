import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';

import { ReusableModule } from '../reusable/reusable.module';
import { TimesheetEntryFormComponent } from './fragment/timesheet-entry-form/timesheet-entry-form.component';
import { TimesheetOverviewComponent } from './page/timesheet-overview/timesheet-overview.component';
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {CardModule} from "primeng/card";

export class TimesheetEndpoints {
  static GET = (start: Date, end: Date) => `timesheet/${start.toString()}/${end.toString()}`;
  static DELETE_ENTRY = (id: number) => `timesheet/entry/${id}`;
  static FORM = 'timesheet';
}

const ROUTES: Routes = [
  {
    path: '',
    component: TimesheetOverviewComponent,
  },
];

@NgModule({
  declarations: [TimesheetOverviewComponent, TimesheetEntryFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    CalendarModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule,
    SelectButtonModule,
    TableModule,
    ConfirmDialogModule,
    TooltipModule,
    ReusableModule,
    InputTextModule,
    DividerModule,
    CheckboxModule,
    ToggleButtonModule,
    TabMenuModule,
    AccordionModule,
    ConfirmPopupModule,
    CardModule,
  ],
})
export class TimesheetModule {}
