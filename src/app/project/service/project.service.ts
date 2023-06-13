import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
