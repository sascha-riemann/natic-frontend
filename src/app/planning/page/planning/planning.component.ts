import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  formatISO,
  Interval,
  isSameDay,
  isSaturday,
  isSunday,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, take, tap } from 'rxjs';

import { BusinessService } from '../../../business/service/business.service';
import { BusinessUtils } from '../../../business/utils/business-utils';
import { ProjectOverviewDTO } from '../../../project/dto/projectOverviewDTO';
import { ProjectService } from '../../../project/service/project.service';
import { Resource, ResourceDto } from '../../../resources/dto/resource.dto';
import { GET_CATEGORY_TITLE } from '../../../timesheet/model/timesheet-entry-category';
import { User } from '../../../user/dto/user';
import { UserService } from '../../../user/service/user.service';
import { DialogPlanningProjectSelectionComponent } from '../../dialog/dialog-planning-project-selection/dialog-planning-project-selection.component';
import { Planning } from '../../dto/planning';
import { PlanningEndpoints } from '../../planning.module';

export interface Project {
  id: number;
  name: string;
}

interface PlanningPageViewModel {
  dateRange: Interval;
  userOptions: User[];
  projectOptions: ProjectOverviewDTO[];
  plannedDays: { date: Date; plannings: Planning[] }[];
  resources: ResourceDto[];
  expansionStates: Record<string, boolean>;
}

interface WeekendVisibility {
  saturday: boolean;
  sunday: boolean;
}

@UntilDestroy()
@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent {
  readonly currentWeek = {
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  };

  readonly dateRange$ = new BehaviorSubject<Interval>(this.currentWeek);

  readonly weekendVisibilityFormGroup = new FormGroup({
    saturday: new FormControl<boolean>(false),
    sunday: new FormControl<boolean>(false),
  });

  readonly users$: Observable<User[]> = this.userService.getUsers();

  readonly resources$ = this.businessService.getBusinessResourceOverview();

  selectedProjects: Project[] = [];
  selectedUsers: User[] = [];
  selectedResources: { [resourceCategoryId: number]: Resource[] } = {};

  readonly filter = new FormGroup({
    users: new FormControl<NonNullable<User[]>>([]),
    projects: new FormControl<NonNullable<Project[]>>([]),
  });
  readonly filterValue$ = this.filter.valueChanges as Observable<{ users: User[]; projects: Project[] }>;

  readonly reload$ = new Subject<void>();

  readonly reloadExpansionStates$ = new Subject<void>();
  readonly expansionStates$ = this.reloadExpansionStates$.pipe(
    startWith(null),
    map(() => this.getExpansionStates()),
  );

  private readonly projects$ = this.reload$.pipe(
    startWith(null),
    switchMap(() => this.projectService.getProjects()),
  );

  private readonly planningProjects$ = combineLatest([this.projects$, this.dateRange$, this.reload$.pipe(startWith(null))]).pipe(
    map(([projects, interval]) => {
      const selection = this.getProjectSelectionForInterval(interval);
      return projects.filter(p => selection?.some(s => s === p.id));
    }),
  );

  private readonly planning$ = new BehaviorSubject<Planning[]>([]);

  private readonly weekendVisibility$ = this.weekendVisibilityFormGroup.valueChanges as Observable<WeekendVisibility>;

  private readonly plannedDays$: Observable<{ date: Date; plannings: Planning[] }[]> = combineLatest([
    this.dateRange$,
    this.planning$,
    this.filterValue$.pipe(startWith({ users: [], projects: [] })),
    this.weekendVisibility$.pipe(startWith(this.getWeekendVisibility())),
  ]).pipe(
    map(
      ([dateRange, plannings, filter, weekendVisibility]: [
        Interval,
        Planning[],
        { users: User[]; projects: Project[] },
        { saturday: boolean; sunday: boolean },
      ]) => {
        const range = eachDayOfInterval(dateRange as Interval);
        if (!weekendVisibility.saturday) {
          const saturdayIndex = range.findIndex(d => isSaturday(d));
          range.splice(saturdayIndex, 1);
        }

        if (!weekendVisibility.sunday) {
          const sundayIndex = range.findIndex(d => isSunday(d));
          range.splice(sundayIndex, 1);
        }
        return range.map(date => {
          let planningThisDay = plannings.filter(p => isSameDay(p.date, date));
          if (filter.projects?.length) {
            planningThisDay = planningThisDay.filter(p => filter.projects.some(projectOfFilter => projectOfFilter.id === p.project.id));
          }
          if (filter.users?.length) {
            planningThisDay = planningThisDay.filter(p => filter.users.some(usersOfFilter => p.users.some(s => usersOfFilter.id === s.id)));
          }

          return {
            date,
            plannings: planningThisDay,
          };
        });
      },
    ),
  );

  readonly viewModel$: Observable<PlanningPageViewModel> = combineLatest([
    this.planningProjects$,
    this.users$,
    this.plannedDays$,
    this.dateRange$,
    this.resources$,
    this.expansionStates$,
  ]).pipe(
    map(([projectOptions, userOptions, plannedDays, dateRange, resources, expansionStates]) => ({
      plannedDays,
      projectOptions,
      userOptions,
      dateRange,
      resources,
      expansionStates,
    })),
  );

  constructor(
    private readonly http: HttpClient,
    private readonly projectService: ProjectService,
    private readonly businessService: BusinessService,
    private readonly dialog: DialogService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {
    this.weekendVisibilityFormGroup.setValue(this.getWeekendVisibility());
    this.weekendVisibilityFormGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(config => this.setWeekendVisibility(config as WeekendVisibility));

    this.route.paramMap
      .pipe(
        tap(paramMap => {
          const start = paramMap.get('start');
          const end = paramMap.get('end');
          if (start && end) {
            this.dateRange$.next({
              start: new Date(start),
              end: new Date(end),
            } as Interval);
          } else {
            this.dateRange$.next(this.currentWeek);
            this.updateDateRangeParams(this.currentWeek);
          }
        }),
        untilDestroyed(this),
      )
      .subscribe();

    this.reload$
      .pipe(
        startWith(null),
        switchMap(() => this.dateRange$),
        switchMap(dateRange =>
          this.http.get<Planning[]>(PlanningEndpoints.GET(BusinessUtils.GET_ID()!, new Date(dateRange.start), new Date(dateRange.end))),
        ),
        map(plannings =>
          plannings.map(
            planning =>
              ({
                id: planning.id,
                project: planning.project,
                users: planning.users,
                date: new Date(planning.date),
                resources: planning.resources,
                created: new Date(planning.created),
              } as Planning),
          ),
        ),
        untilDestroyed(this),
      )
      .subscribe(r => {
        this.planning$.next(r);
      });
  }

  setWeekendVisibility(config: WeekendVisibility): void {
    localStorage.setItem('weekendVisibility', JSON.stringify(config));
  }

  getWeekendVisibility(): WeekendVisibility {
    const item = localStorage.getItem('weekendVisibility');
    if (item) {
      return JSON.parse(item) as WeekendVisibility;
    } else {
      const config = { saturday: false, sunday: false };
      this.setWeekendVisibility(config);
      return config;
    }
  }

  updateDateRangeParams(dateRange: Interval): void {
    const start = formatISO(dateRange.start);
    const end = formatISO(dateRange.end);
    this.location.replaceState(`/planning/${start}/${end}`);
  }

  previousDay(): void {
    const dateRange = this.dateRange$.value;
    dateRange.start = subWeeks(dateRange.start, 1);
    dateRange.end = subWeeks(dateRange.end, 1);
    this.dateRange$.next(dateRange);
    this.updateDateRangeParams(dateRange);
  }

  nextDay(): void {
    const dateRange = this.dateRange$.value;
    dateRange.start = addWeeks(dateRange.start, 1);
    dateRange.end = addWeeks(dateRange.end, 1);
    this.dateRange$.next(dateRange);
    this.updateDateRangeParams(dateRange);
  }

  selectCurrentWeek(): void {
    const dateRange = {
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    };
    this.dateRange$.next(dateRange);
    this.updateDateRangeParams(dateRange);
  }

  addPlanning(date: Date, projectId: number): void {
    const projectToAdd = this.selectedProjects.find(project => project.id === projectId);
    this.http
      .post<number>(PlanningEndpoints.CREATE(date, projectId), null)
      .pipe(take(1))
      .subscribe(
        () => {
          if (projectToAdd) {
            this.reload$.next();
          }
        },
        () => {
          alert('ERROR SAVING PLANNING PROJECT TO DAY');
        },
      );
  }

  getPlanningProjectsToAdd(plannings: Planning[]): Project[] {
    return this.selectedProjects.filter(selectedProject => {
      return !plannings.some(planning => planning.project.id === selectedProject.id);
    });
  }

  removePlanning(planningId: number): void {
    this.http
      .delete(PlanningEndpoints.DELETE(planningId))
      .pipe(take(1))
      .subscribe(
        () => {
          this.reload$.next();
        },
        () => {
          // TODO: Error handling
        },
      );
  }

  getPlanningUsersToAdd(planning: Planning): User[] {
    return this.selectedUsers.filter(users => !planning?.users?.some(s => s.id === users.id));
  }

  addPlanningUser(plannedDate: Date, projectId: number, userId: number): void {
    const planned = this.planning$.value;
    const plan = planned.find(plannedDay => plannedDay.project.id === projectId && isSameDay(plannedDay.date, plannedDate));

    if (plan) {
      const usersToAdd = this.selectedUsers.find(users => userId === users.id);

      this.http
        .post(PlanningEndpoints.USER_ADD(plan.id, userId), null)
        .pipe(take(1))
        .subscribe(
          () => {
            if (usersToAdd) {
              plan?.users.push(usersToAdd);
              this.planning$.next(planned);
            }
          },
          () => {
            alert('ERROR SAVING PLANNING PROJECT TO DAY');
          },
        );
    }
  }

  removePlanningUsers(planningId: number, userId: number): void {
    const planned = this.planning$.value;
    const plan = planned.find(plan => plan.id === planningId);
    const userIndex = plan?.users.findIndex(user => user.id === userId);

    this.http
      .delete(PlanningEndpoints.USER_DELETE(planningId, userId))
      .pipe(take(1))
      .subscribe(
        () => {
          if (plan && userIndex !== undefined && userIndex >= 0) {
            plan?.users.splice(userIndex, 1);
            this.planning$.next(planned);
          }
        },
        () => {
          alert('ERROR SAVING PLANNING PROJECT TO DAY');
        },
      );
  }

  getPlanningResourcesToAdd(resourceGroup: ResourceDto, resourceCategoryId: number): Resource[] {
    return this.selectedResources[resourceCategoryId]?.filter(resources => !resourceGroup?.resources?.some(r => r.id === resources.id));
  }

  addPlanningResource(plannedDate: Date, projectId: number, resourceId: number, resourceCategoryId: number): void {
    const planned = this.planning$.value;
    const plan = planned.find(plannedDay => plannedDay.project.id === projectId && isSameDay(plannedDay.date, plannedDate));

    if (plan) {
      const resourcesToAdd = this.selectedResources[resourceCategoryId].find(resource => resourceId === resource.id);

      this.http
        .post(PlanningEndpoints.RESOURCE_ADD(plan.id, resourceId), null)
        .pipe(take(1))
        .subscribe(
          () => {
            if (resourcesToAdd) {
              plan?.resources.find(resource => resource.category.id === resourceCategoryId)?.resources.push(resourcesToAdd);
              this.planning$.next(planned);
            }
          },
          () => {
            alert('ERROR SAVING PLANNING PROJECT TO DAY');
          },
        );
    }
  }

  removePlanningResource(planningId: number, resourceCategoryId: number, resourceId: number): void {
    const planned = this.planning$.value;
    const plan = planned.find(plan => plan.id === planningId);
    const resourceGroup = plan?.resources.find(resource => resource.category.id === resourceCategoryId);
    const resourceIndex = resourceGroup?.resources.findIndex(resource => resource.id === resourceId);

    this.http
      .delete(PlanningEndpoints.RESOURCE_DELETE(planningId, resourceId))
      .pipe(take(1))
      .subscribe(
        () => {
          if (plan && resourceIndex !== undefined && resourceIndex >= 0) {
            resourceGroup?.resources.splice(resourceIndex, 1);
            this.planning$.next(planned);
          }
        },
        () => {
          alert('ERROR SAVING PLANNING PROJECT TO DAY');
        },
      );
  }

  changePlanningExpansionStatus(planningId: number | string, expansionState: boolean): void {
    const planningExpansion = this.getExpansionStates();
    planningExpansion[planningId] = expansionState;
    localStorage.setItem('planningExpansion', JSON.stringify(planningExpansion));
    this.reloadExpansionStates$.next();
  }

  getExpansionStates(): Record<string, boolean> {
    const storageItem = localStorage.getItem('planningExpansion');
    return (storageItem ? JSON.parse(storageItem) : {}) as Record<string, boolean>;
  }

  getProjectSelection(): Record<string, number[]> {
    const planningProjectSelection = localStorage.getItem('planningProjectSelection');
    return planningProjectSelection ? (JSON.parse(planningProjectSelection) as Record<string, number[]>) : {};
  }

  getProjectSelectionForInterval(interval: Interval): number[] {
    const planningProjectSelection = this.getProjectSelection();
    return planningProjectSelection[`${format(interval.start, 'dd.MM.yyyy')}-${format(interval.end, 'dd.MM.yyyy')}`];
  }

  addPlanningProjectSelection(projectIds: number[], interval: Interval): void {
    const planningProjectSelection = this.getProjectSelection();
    planningProjectSelection[`${format(interval.start, 'dd.MM.yyyy')}-${format(interval.end, 'dd.MM.yyyy')}`] = projectIds;
    localStorage.setItem('planningProjectSelection', JSON.stringify(planningProjectSelection));
  }

  editPlanningProjectSelection(selection: Project[]): void {
    this.dialog
      .open(DialogPlanningProjectSelectionComponent, {
        header: 'Projekte für Planung auswählen',
        styleClass: 'dialog',
        data: selection.map(s => s.id),
      })
      .onClose.pipe(take(1))
      .subscribe((result?: Project[]) => {
        if (result) {
          this.reload$.next();

          this.addPlanningProjectSelection(
            result.map(r => r.id),
            this.dateRange$.value,
          );

          this.selectedProjects = this.selectedProjects.filter(selectedProject => result.some(r => r.id === selectedProject.id));
        }
      });
  }

  protected readonly GET_CATEGORY_TITLE = GET_CATEGORY_TITLE;
}
