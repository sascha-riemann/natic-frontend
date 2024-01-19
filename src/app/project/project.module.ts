import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule, Routes } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';

import { CancelSaveComponent } from '../reusable/component/cancel-save/cancel-save.component';
import { PageComponent } from '../reusable/page/page/page.component';
import { ReusableModule } from '../reusable/reusable.module';
import { ProjectComponent } from './page/project/project.component';
import { ProjectCreatePageComponent } from './page/project-create/project-create.page.component';
import { ProjectOverviewComponent } from './page/project-overview/project-overview.component';
import { ProjectScheduleComponent } from './page/project-schedule/project-schedule.component';
import { ProjectSettingsComponent } from './page/project-settings/project-settings.component';
import { ProjectTaskCreateComponent } from './page/project-task/project-task-create/project-task-create.component';
import { ProjectTaskUpdateComponent } from './page/project-task/project-task-update/project-task-update.component';
import { ProjectTasksComponent } from './page/project-tasks/project-tasks.component';
import { ProjectUsersComponent } from './page/project-users/project-users.component';
import { ProjectsComponent } from './page/projects/projects.component';
import { ProjectOverviewResolver } from './resolver/project-overview.resolver';

export class ProjectEndpoints {
  static LIST = 'project/list';
  static CREATE = 'project';
  static getUsers = (projectId: number) => `project/${projectId}/users`;
  static setUsers = (projectId: number) => `project/${projectId}/users`;
  static UPDATE = (projectId: number) => `project/${projectId}`;
  static OVERVIEW = (projectId: number) => `project/${projectId}/overview`;
  static SCHEDULE = (projectId: number) => `project/${projectId}/schedule`;
  static SCHEDULES = (projectId: number) => `project/${projectId}/schedules`;
}

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    component: ProjectsComponent,
  },
  {
    path: 'create',
    component: ProjectCreatePageComponent,
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
      {
        path: 'users',
        component: ProjectUsersComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    ProjectCreatePageComponent,
    ProjectOverviewComponent,
    ProjectTasksComponent,
    ProjectScheduleComponent,
    ProjectSettingsComponent,
    ProjectUsersComponent,
    ProjectTaskCreateComponent,
    ProjectTaskUpdateComponent,
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
    SkeletonModule,
    DialogModule,
    ToastModule,
    FileUploadModule,
    CalendarModule,
    TreeTableModule,
    GoogleMapsModule,
    MessageModule,
    ReusableModule,
    TableModule,
    ConfirmDialogModule,
    PageComponent,
    TabViewModule,
    FormsModule,
    TagModule,
    CancelSaveComponent,
    SelectButtonModule,
    ChipsModule,
    MultiSelectModule,
    ConfirmPopupModule,
  ],
  providers: [MessageService],
})
export class ProjectModule {}
