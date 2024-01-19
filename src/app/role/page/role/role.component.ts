import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {combineLatest, map, of, shareReplay, switchMap, take, tap} from 'rxjs';

import { User } from '../../../user/dto/user';
import { UserService } from '../../../user/service/user.service';
import { PermissionTitlesBusiness, PermissionTitlesProject } from '../../model/permission';
import { BusinessPermissions, ProjectPermissions, Role, RoleCreate } from '../../model/role';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent {
  readonly formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    businessPermissions: new FormControl<(keyof BusinessPermissions)[]>([]),
    projectPermissions: new FormControl<(keyof ProjectPermissions)[]>([]),
  });

  private readonly users$ = this.userService.getUsers();

  readonly role$ = this.route.paramMap.pipe(
    map(paramMap => Number(paramMap.get('id'))),
    switchMap(roleId => (roleId ? this.roleService.getRole(roleId) : of(null))),
    tap(result => console.log('Result', result)),
  );

  readonly businessPermissions = Object.keys(PermissionTitlesBusiness).map(key => ({
    label: PermissionTitlesBusiness[key],
    value: key,
  }));

  readonly projectPermissions = Object.keys(PermissionTitlesProject).map(key => ({
    label: PermissionTitlesProject[key],
    value: key,
  }));

  availableUsers: User[] = [];
  selectedUsers: User[] = [];

  constructor(
    private readonly roleService: RoleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {
    this.role$.pipe(take(1)).subscribe(role => {
      if (role) {
        this.formGroup.patchValue({
          name: role.name,
          projectPermissions: Object.entries(role.projectPermissions)
            .filter(([key, value]) => value === true)
            .map(([key]) => key) as (keyof ProjectPermissions)[],
          businessPermissions: Object.entries(role.businessPermissions)
            .filter(([key, value]) => value === true)
            .map(([key]) => key) as (keyof BusinessPermissions)[],
        });
      }
    });

    combineLatest([this.users$, this.role$])
      .pipe(take(1))
      .subscribe(([users, role]: [User[], Role | null]) => {
        this.availableUsers = users.filter(u => !role?.users.some(roleUser => roleUser.id === u.id));
        this.selectedUsers = users.filter(u => role?.users.some(roleUser => roleUser.id === u.id));
      });
  }

  save(): void {
    if (this.formGroup.valid) {
      const businessPermissions = new BusinessPermissions();
      this.formGroup.value.businessPermissions?.forEach((key: keyof BusinessPermissions) => {
        businessPermissions[key] = true;
      });

      const projectPermissions = new ProjectPermissions();
      this.formGroup.value.projectPermissions?.forEach((key: keyof ProjectPermissions) => {
        projectPermissions[key] = true;
      });

      const result = {
        name: this.formGroup.value.name as string,
        businessPermissions,
        projectPermissions,
        userIds: this.selectedUsers.map(u => u.id),
      } as RoleCreate;

      this.role$
        .pipe(
          switchMap(role => {
            if (role) {
              return this.roleService.updateRole(role.id, { ...result, id: role.id });
            } else {
              return this.roleService.createRole(result);
            }
          }),
          take(1),
        )
        .subscribe(() => void this.router.navigate([`/roles`]));
    }
  }
}
