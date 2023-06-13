import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { ProjectOverviewDTO } from '../../dto/projectOverviewDTO';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
})
export class ProjectOverviewComponent {
  projectOverview$: Observable<ProjectOverviewDTO> = this.route.parent!.data.pipe(map(data => data['overview'] as ProjectOverviewDTO));

  constructor(private readonly http: HttpClient, private readonly route: ActivatedRoute) {}
}
