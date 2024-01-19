import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role, RoleCreate, UpdateRole } from '../model/role';
import { RoleEndpoints } from '../role.module';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private readonly http: HttpClient) {}

  createRole(dto: RoleCreate): Observable<number> {
    return this.http.post<number>(RoleEndpoints.create, dto);
  }

  updateRole(roleId: number, dto: UpdateRole): Observable<number> {
    return this.http.post<number>(RoleEndpoints.update(roleId), dto);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(RoleEndpoints.list);
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(RoleEndpoints.getById(id));
  }
}
