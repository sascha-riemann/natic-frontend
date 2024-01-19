import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ProjectOverviewDTO } from '../../dto/projectOverviewDTO';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  options$ = this.projectService.getProjects();

  constructor(private readonly router: Router, private readonly http: HttpClient, private readonly projectService: ProjectService) {}

  selectProject(project: ProjectOverviewDTO): void {
    void this.router.navigateByUrl(`/project/${project.id.toString()}`);
  }
}
