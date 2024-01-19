import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectUsers } from '../dto/project.dto';
import { ProjectOverviewDTO } from '../dto/projectOverviewDTO';
import { ProjectEndpoints } from '../project.module';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  getProjects() {
    return this.http.get<ProjectOverviewDTO[]>(ProjectEndpoints.LIST);
  }

  setUsers(id: number, userIds: number[]): Observable<void> {
    return this.http.post<void>(ProjectEndpoints.setUsers(id), userIds);
  }

  getUsers(id: number) {
    return this.http.get<ProjectUsers>(ProjectEndpoints.getUsers(id));
  }
}
