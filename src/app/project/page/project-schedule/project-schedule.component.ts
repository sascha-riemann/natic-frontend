import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { formatDuration, intervalToDuration } from 'date-fns';
import { TreeNode } from 'primeng/api';
import { map, Observable, startWith, Subject, switchMap, take } from 'rxjs';

import { ProjectEndpoints } from '../../project.module';

export interface Schedule {
  name: string;
  description: string;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-project-schedule',
  templateUrl: './project-schedule.component.html',
  styleUrls: ['./project-schedule.component.scss'],
})
export class ProjectScheduleComponent {
  showDialog = false;

  treeNodeToAdd: null | TreeNode<Schedule> = null;

  readonly scheduleFormGroup = new FormGroup({
    name: new FormControl(undefined),
    description: new FormControl(undefined),
    start: new FormControl(undefined),
    end: new FormControl(undefined),
  });

  readonly reload$ = new Subject<void>();

  readonly schedules$: Observable<TreeNode<Schedule>[]> = this.reload$.pipe(
    startWith([]),
    switchMap(() => this.route.parent!.paramMap),
    map((paramMap: ParamMap) => Number(paramMap.get('id'))),
    switchMap(projectId => this.http.get<Schedule[]>(ProjectEndpoints.SCHEDULES(projectId))),
    map((schedules: Schedule[]) =>
      schedules.map(
        schedule =>
          ({
            data: {
              name: schedule.name,
              description: schedule.description,
              start: new Date(schedule.start),
              end: new Date(schedule.end),
            },
          } as TreeNode<Schedule>),
      ),
    ),
  );

  constructor(private readonly http: HttpClient, private readonly route: ActivatedRoute) {}

  format(start: Date, end: Date): string {
    const duration = intervalToDuration({
      start,
      end,
    });
    return formatDuration(duration);
  }

  openScheduleDialog(treeNode?: TreeNode<Schedule>) {
    this.showDialog = true;
    this.treeNodeToAdd = treeNode || null;
  }

  addSchedule(): void {
    const form = this.scheduleFormGroup.value;
    this.route
      .parent!.paramMap.pipe(
        map((paramMap: ParamMap) => Number(paramMap.get('id'))),
        switchMap((projectId: number) =>
          this.http.post(ProjectEndpoints.SCHEDULE(projectId), {
            name: form.name!,
            description: form.description!,
            start: form.start!,
            end: form.end!,
          }),
        ),
        take(1),
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }
}
