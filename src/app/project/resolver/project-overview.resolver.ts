import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { ProjectOverviewDTO } from '../dto/projectOverviewDTO';
import { ProjectEndpoints } from '../project.module';

@Injectable({
  providedIn: 'root',
})
export class ProjectOverviewResolver implements Resolve<ProjectOverviewDTO> {
  constructor(private readonly http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ProjectOverviewDTO> {
    const projectId = route.paramMap.get('id');
    return this.http.get<ProjectOverviewDTO>(ProjectEndpoints.OVERVIEW(Number(projectId)));
  }
}
