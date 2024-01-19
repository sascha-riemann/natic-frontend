import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import { ProjectCreateDto } from '../../../project/dto/project-create.dto';
import { ProjectOverviewDTO } from '../../../project/dto/projectOverviewDTO';
import { ProjectEndpoints } from '../../../project/project.module';

@Component({
  selector: 'app-planning-page-create-project',
  templateUrl: './planning-page-create-project.component.html',
  styleUrls: ['./planning-page-create-project.component.scss'],
})
export class PlanningPageCreateProjectComponent {
  readonly formGroup = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    description: new FormControl(undefined, Validators.required),
    address: new FormControl(undefined, Validators.required),
  });

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogRef: DynamicDialogRef,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  create(): void {
    if (this.formGroup.valid) {
      this.http
        .post<ProjectOverviewDTO>(ProjectEndpoints.CREATE, {
          name: this.formGroup.get('name')!.value!,
          description: this.formGroup.get('description')!.value!,
          address: this.formGroup.get('address')!.value!,
        } as ProjectCreateDto)
        .pipe(take(1))
        .subscribe(result => {
          this.dialogRef.close(result);
        });
    }
  }
}
