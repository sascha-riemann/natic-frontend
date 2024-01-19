import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { ProjectCreateDto } from '../../dto/project-create.dto';
import { ProjectEndpoints } from '../../project.module';

@Component({
  selector: 'app-project-create-page',
  templateUrl: './project-create.page.component.html',
  styleUrls: ['./project-create.page.component.scss'],
})
export class ProjectCreatePageComponent {
  formGroup = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    description: new FormControl(undefined, Validators.required),
    address: new FormControl(undefined, Validators.required),
  });

  constructor(private readonly http: HttpClient, private readonly router: Router, private readonly route: ActivatedRoute) {}

  create(): void {
    if (this.formGroup.valid) {
      this.http
        .post<number>(ProjectEndpoints.CREATE, {
          name: this.formGroup.get('name')!.value!,
          description: this.formGroup.get('description')!.value!,
          address: this.formGroup.get('address')!.value!,
        } as ProjectCreateDto)
        .pipe(take(1))
        .subscribe(result => {
          void this.router.navigate([`../${result}`], {
            relativeTo: this.route,
          });
        });
    }
  }
}
