import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, take } from 'rxjs';

import { ProjectCreateDto } from '../../dto/project-create.dto';
import { ProjectOverviewDTO } from '../../dto/projectOverviewDTO';
import { ProjectEndpoints } from '../../project.module';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
})
export class ProjectSettingsComponent {
  formGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
  });

  projectOverview$: Observable<ProjectOverviewDTO> = this.route.parent!.data.pipe(map(data => data['overview'] as ProjectOverviewDTO));

  constructor(private readonly http: HttpClient, private readonly router: Router, private readonly route: ActivatedRoute) {
    this.projectOverview$.pipe(take(1)).subscribe((projectOverview: ProjectOverviewDTO) => {
      this.formGroup.patchValue({
        name: projectOverview.name,
        description: projectOverview.description,
        address: projectOverview.address,
      });
    });
  }

  save(): void {
    if (this.formGroup.valid) {
      this.route
        .parent!.paramMap.pipe(
          map(paramMap => Number(paramMap.get('id'))),
          switchMap(projectId =>
            this.http.post<number>(ProjectEndpoints.UPDATE(projectId), {
              name: this.formGroup.get('name')!.value!,
              description: this.formGroup.get('description')!.value!,
              address: this.formGroup.get('address')!.value!,
            } as ProjectCreateDto),
          ),
          take(1),
        )
        .subscribe(() => location.reload());
    }
  }
}
