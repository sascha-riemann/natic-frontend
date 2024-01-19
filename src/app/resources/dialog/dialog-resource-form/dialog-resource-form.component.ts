import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable, take } from 'rxjs';

import { BusinessService } from '../../../business/service/business.service';
import { Resource } from '../../dto/resource.dto';
import { ResourceCategory } from '../../dto/resource-category.dto';
import { ResourceCreateDto, ResourceUpdateDto } from '../../dto/resource-create.dto';
import { ResourceService } from '../../service/resource.service';

@Component({
  selector: 'app-dialog-resource-form',
  templateUrl: './dialog-resource-form.component.html',
  styleUrls: ['./dialog-resource-form.component.scss'],
})
export class DialogResourceFormComponent {
  resource?: Resource;

  readonly resourceCategories$: Observable<ResourceCategory[]> = this.businessService
    .getBusinessResourceOverview()
    .pipe(map(dtos => dtos.map(res => res.category)));

  readonly resourceFormGroup = new FormGroup({
    categoryId: new FormControl<number | undefined>(undefined, Validators.required),
    name: new FormControl<string | undefined>(undefined, Validators.required),
    identification: new FormControl<string | undefined>(undefined, Validators.required),
  });

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly resourceService: ResourceService,
    private readonly businessService: BusinessService,
  ) {
    const resource = config.data as Resource;
    if (resource) {
      this.resource = resource;
      this.resourceFormGroup.patchValue({
        name: resource.name,
        categoryId: resource.category.id,
        identification: resource.identification,
      });
    }
  }

  cancel(): void {
    this.ref?.close(false);
  }

  create(): void {
    if (this.resourceFormGroup.valid) {
      const value = this.resourceFormGroup.value;
      const resource = {
        categoryId: value.categoryId!,
        name: value.name!,
        identification: value.identification!,
      } as ResourceCreateDto;

      if (this.resource) {
        this.resourceService
          .updateResource(this.resource.id, {
            id: this.resource.id,
            ...resource,
          } as ResourceUpdateDto)
          .pipe(take(1))
          .subscribe(() => {
            this.resourceFormGroup.reset();
            this.ref?.close(true);
          });
      } else {
        this.resourceService
          .createResource(resource)
          .pipe(take(1))
          .subscribe(() => {
            this.resourceFormGroup.reset();
            this.ref?.close(true);
          });
      }
    }
  }
}
