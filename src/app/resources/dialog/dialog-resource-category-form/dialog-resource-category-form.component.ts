import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import { ResourceCategory } from '../../dto/resource-category.dto';
import { ResourceService } from '../../service/resource.service';

@Component({
  selector: 'app-dialog-resource-category-form',
  templateUrl: './dialog-resource-category-form.component.html',
  styleUrls: ['./dialog-resource-category-form.component.scss'],
})
export class DialogResourceCategoryFormComponent {
  resourceCategory?: ResourceCategory;

  readonly resourceName = new FormControl<string | undefined>(undefined, Validators.required);

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly resourceService: ResourceService,
  ) {
    const resourceCategory = config.data as ResourceCategory;
    if (resourceCategory) {
      this.resourceCategory = resourceCategory;
      this.resourceName.setValue(resourceCategory.name);
    }
  }

  cancel(): void {
    this.ref?.close(false);
  }

  create(): void {
    if (this.resourceName.valid) {
      const value = this.resourceName.value as string;

      if (this.resourceCategory) {
        this.resourceService
          .updateResourceCategory({ id: this.resourceCategory.id, name: value })
          .pipe(take(1))
          .subscribe(() => {
            this.ref?.close(true);
          });
      } else {
        this.resourceService
          .createResourceCategory({ name: value })
          .pipe(take(1))
          .subscribe(() => {
            this.ref.close(true);
          });
      }
    }
  }

  delete(): void {
    if (this.resourceCategory) {
      this.resourceService
        .deleteResourceCategory(this.resourceCategory.id)
        .pipe(take(1))
        .subscribe(() => {
          this.ref.close(true);
        });
    }
  }
}
