import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule, Routes } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';

import { ReusableModule } from '../reusable/reusable.module';
import { ProjectComponent } from './page/project/project.component';
import { ProjectCreateComponent } from './page/project-create/project-create.component';
import { ProjectOverviewComponent } from './page/project-overview/project-overview.component';
import { ProjectScheduleComponent } from './page/project-schedule/project-schedule.component';
import { ProjectSettingsComponent } from './page/project-settings/project-settings.component';
import { ProjectTasksComponent } from './page/project-tasks/project-tasks.component';
import { ProjectsComponent } from './page/projects/projects.component';
import { ProjectOverviewResolver } from './resolver/project-overview.resolver';
import {MessageModule} from "primeng/message";

export class ProjectEndpoints {
  static LIST = 'project/list';
  static CREATE = 'project';
  static UPDATE = (projectId: number) => `project/${projectId}`;
  static OVERVIEW = (projectId: number) => `project/${projectId}/overview`;
  static SCHEDULE = (projectId: number) => `project/${projectId}/schedule`;
  static SCHEDULES = (projectId: number) => `project/${projectId}/schedules`;
}

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    component: ProjectsComponent,
  },
  {
    path: 'create',
    component: ProjectCreateComponent,
  },
  {
    path: ':id',
    pathMatch: 'prefix',
    component: ProjectComponent,
    resolve: {
      overview: ProjectOverviewResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        component: ProjectOverviewComponent,
      },
      {
        path: 'tasks',
        component: ProjectTasksComponent,
      },
      {
        path: 'schedule',
        component: ProjectScheduleComponent,
      },
      {
        path: 'settings',
        component: ProjectSettingsComponent,
      },
      // {
      //   path: 'staff',
      //   component: ConstructionSiteStaffComponent,
      // },
    ],
  },
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    ProjectCreateComponent,
    ProjectOverviewComponent,
    ProjectTasksComponent,
    ProjectScheduleComponent,
    ProjectSettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    MenuModule,
    CardModule,
    ListboxModule,
    ReusableModule,
    SkeletonModule,
    DialogModule,
    ToastModule,
    FileUploadModule,
    CalendarModule,
    TreeTableModule,
    GoogleMapsModule,
    MessageModule,
  ],
  providers: [MessageService],
})
export class ProjectModule {}
