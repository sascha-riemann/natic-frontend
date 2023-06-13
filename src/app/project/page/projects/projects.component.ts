import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListboxClickEvent } from 'primeng/listbox/listbox.interface';

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

  selectProject(event: ListboxClickEvent): void {
    const project = event.option as ProjectOverviewDTO;
    void this.router.navigateByUrl(`/project/${project.id.toString()}`);
  }
}
