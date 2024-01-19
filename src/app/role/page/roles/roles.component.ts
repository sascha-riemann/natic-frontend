import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListboxClickEvent } from 'primeng/listbox/listbox.interface';

import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  readonly roles$ = this.roleService.getRoles();

  constructor(private readonly http: HttpClient, private readonly router: Router, private readonly roleService: RoleService) {}

  openRole(event: ListboxClickEvent): void {
    const roleId = event.value as number;
    void this.router.navigate([`/roles/${roleId.toString()}`]);
  }
}
