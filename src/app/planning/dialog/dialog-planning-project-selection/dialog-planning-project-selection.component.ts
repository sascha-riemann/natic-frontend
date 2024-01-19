import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { startWith, Subject, switchMap, take } from 'rxjs';

import { ProjectOverviewDTO } from '../../../project/dto/projectOverviewDTO';
import { ProjectService } from '../../../project/service/project.service';
import { PlanningPageCreateProjectComponent } from '../../component/planning-page-create-project/planning-page-create-project.component';
import { Project } from '../../page/planning/planning.component';

@UntilDestroy()
@Component({
  selector: 'app-dialog-planning-project-selection',
  templateUrl: './dialog-planning-project-selection.component.html',
  styleUrls: ['./dialog-planning-project-selection.component.scss'],
})
export class DialogPlanningProjectSelectionComponent {
  available: Project[] = [];
  selected: Project[] = [];

  readonly reload$ = new Subject<void>();

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly projectService: ProjectService,
    private readonly dialog: DialogService,
  ) {
    this.reload$
      .pipe(
        startWith(null),
        switchMap(() => this.projectService.getProjects()),
        untilDestroyed(this),
      )
      .subscribe((result: ProjectOverviewDTO[]) => {
        const available = result;
        const passedProjectIds = this.getDialogDataProjectIds();
        this.selected = available.filter(project => passedProjectIds.some(projectId => projectId === project.id));
        this.available = available.filter(availableProject => !this.selected.some(p => p.id === availableProject.id));
      });
  }

  getDialogDataProjectIds(): number[] {
    return (this.config.data as number[]) || [];
  }

  cancel(): void {
    this.ref.close(false);
  }

  createProject(): void {
    this.dialog
      .open(PlanningPageCreateProjectComponent, {
        header: 'Projekt erstellen',
        styleClass: 'dialog',
      })
      .onClose.pipe(take(1))
      .subscribe((result?: number) => {
        if (result) {
          const projectIds = this.getDialogDataProjectIds();
          projectIds.push(result);
          this.config.data = projectIds;
          this.reload$.next();
        }
      });
  }

  save(): void {
    this.ref.close(this.selected);
  }
}
