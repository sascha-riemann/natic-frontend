import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { combineLatest, filter, map, shareReplay, startWith, Subject, switchMap, take, tap, withLatestFrom } from 'rxjs';

import { RoleService } from '../../../role/service/role.service';
import { User } from '../../../user/dto/user';
import { UserService } from '../../../user/service/user.service';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.scss'],
})
export class ProjectUsersComponent {
  private readonly projectId$ = this.route.parent!.paramMap.pipe(
    map(paramMap => Number(paramMap.get('id'))),
    filter(projectId => !!projectId),
  );

  readonly selectedRoles = new FormControl<number[]>([]);

  readonly roles$ = this.roleService.getRoles();

  private readonly reload$ = new Subject<void>();

  private readonly projectUsers$ = combineLatest([this.projectId$, this.reload$.pipe(startWith(null))]).pipe(
    switchMap(([projectId]) => this.projectService.getUsers(projectId)),
    tap(result => console.log('Result', result)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly options$ = combineLatest([this.projectUsers$, this.selectedRoles.valueChanges.pipe(startWith([]))]).pipe(
    map(([projectUsers, selectedRoleIds]) => projectUsers.filter(user => selectedRoleIds?.some(roleId => user.role?.id === roleId))),
  );

  readonly users$ = this.userService.getUsers();

  visible = false;

  available: User[] = [];
  selected: User[] = [];

  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private readonly roleService: RoleService,
  ) {
    this.roles$.pipe(take(1)).subscribe(roles => this.selectedRoles.setValue(roles.map(r => r.id)));
  }

  openUserSelection(): void {
    this.visible = true;

    combineLatest([this.options$, this.users$])
      .pipe(
        map(([projectUsers, users]) => users.filter(u => !projectUsers.some(pu => pu.id === u.id))),
        take(1),
      )
      .subscribe((availableUsers: User[]) => (this.available = availableUsers));
  }

  cancel(): void {
    this.resetDialog();
  }

  save() {
    this.projectId$
      .pipe(
        switchMap(projectId =>
          this.projectService.setUsers(
            projectId,
            this.selected.map(u => u.id),
          ),
        ),
        take(1),
      )
      .subscribe(() => {
        this.resetDialog();
        this.reload$.next();
      });
  }

  resetDialog(): void {
    this.visible = false;
    this.available = [];
    this.selected = [];
  }

  removeUser(event: Event, user: User): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Benutzer aus projekt entfernen?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
      accept: () => {
        this.projectUsers$
          .pipe(
            map(projectUsers => {
              const index = projectUsers.findIndex(u => u.id === user.id);
              projectUsers.splice(index, 1);
              return projectUsers.map(u => u.id);
            }),
            withLatestFrom(this.projectId$),
            switchMap(([userIds, projectId]) => this.projectService.setUsers(projectId, userIds)),
            take(1),
          )
          .subscribe(() => this.reload$.next());
      },
    });
  }
}
