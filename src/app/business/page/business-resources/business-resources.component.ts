import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable, shareReplay, startWith, Subject, switchMap, take } from 'rxjs';

import { DialogResourceCategoryFormComponent } from '../../../resources/dialog/dialog-resource-category-form/dialog-resource-category-form.component';
import { DialogResourceFormComponent } from '../../../resources/dialog/dialog-resource-form/dialog-resource-form.component';
import { Resource } from '../../../resources/dto/resource.dto';
import { ResourceCategory } from '../../../resources/dto/resource-category.dto';
import { ResourceService } from '../../../resources/service/resource.service';
import { BusinessResourcesDTO } from '../../dto/business-resources-overview';
import { BusinessService } from '../../service/business.service';

@Component({
  selector: 'app-resources',
  templateUrl: './business-resources.component.html',
  styleUrls: ['./business-resources.component.scss'],
})
export class BusinessResourcesComponent {
  readonly reload$ = new Subject<void>();

  readonly resourceOverview$ = this.reload$.pipe(
    startWith(null),
    switchMap(() => this.businessService.getBusinessResourceOverview()),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  readonly resourceCategories$ = this.resourceOverview$.pipe(map(dtos => dtos.map(res => res.category)));

  readonly resources$: Observable<unknown[]> = this.resourceOverview$.pipe(
    map((result: BusinessResourcesDTO[]) => {
      const r: Resource[] = [];
      result.map(res => r.push(...res.resources));
      return r;
    }),
  );

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly resourceService: ResourceService,
    private readonly businessService: BusinessService,
    private readonly dialog: DialogService,
  ) {}

  openResourceDialog(resource?: Resource): void {
    this.dialog
      .open(DialogResourceFormComponent, {
        header: `Ressource ${resource ? 'bearbeiten' : 'erstellen'}`,
        style: {
          width: '100%',
          maxWidth: '35rem',
        },
        ...(resource ? { data: resource } : {}),
      })
      .onClose.pipe(take(1))
      .subscribe((result?: boolean) => {
        if (result) {
          this.reload$.next();
        }
      });
  }

  openResourceCategoryDialog(resourceCategory?: ResourceCategory): void {
    this.dialog
      .open(DialogResourceCategoryFormComponent, {
        header: `Ressourcen Kategorie ${resourceCategory ? 'bearbeiten' : 'erstellen'}`,
        style: {
          width: '100%',
          maxWidth: '35rem',
        },
        ...(resourceCategory ? { data: resourceCategory } : {}),
      })
      .onClose.pipe(take(1))
      .subscribe((result?: boolean) => {
        if (result) {
          this.reload$.next();
        }
      });
  }

  deleteResource(resource: Resource): void {
    this.confirmationService.confirm({
      header: `Resource "${resource.name}" löschen?`,
      message: 'Alle Zuweisungen dieser Resource zu Projekten werden entfernt',
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resourceService
          .deleteResource(resource.id)
          .pipe(take(1))
          .subscribe(() => {
            // TODO: Message
            this.reload$.next();
          });
      },
      reject: () => {
        // TODO: Message
      },
    });
  }
}
