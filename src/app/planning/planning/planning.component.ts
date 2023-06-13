import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { addWeeks, eachDayOfInterval, endOfWeek, Interval, isSameDay, isSaturday, isSunday, startOfWeek, subWeeks } from 'date-fns';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, take } from 'rxjs';

import { UserOverviewDto } from '../../business/dto/user-overview.dto';
import { BusinessService } from '../../business/service/business.service';
import { BusinessUtils } from '../../business/utils/business-utils';
import { ProjectService } from '../../project/service/project.service';
import { PlanningEndpoints } from '../planning.module';

type User = UserOverviewDto;

interface Planning {
  id: number;
  date: Date;
  project: Project;
  users: User[];
}

interface Project {
  id: number;
  name: string;
}

interface PlanningPageViewModel {
  dateRange: Interval;
  userOptions: User[];
  projectOptions: Project[];
  plannedDays: { date: Date; plannings: Planning[] }[];
}

@UntilDestroy()
@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent {
  readonly dateRange$ = new BehaviorSubject<Interval>({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  readonly weekendVisibility = new FormGroup({
    saturday: new FormControl<boolean>(true),
    sunday: new FormControl<boolean>(true),
  });

  readonly weekendVisibilityValue$ = this.weekendVisibility.valueChanges as Observable<{ saturday: boolean; sunday: boolean }>;

  projects$: Observable<Project[]> = this.projectService.getProjects();
  users$: Observable<User[]> = this.businessService.getBusinessUsers();

  selectedProjects: Project[] = [];
  selectedUsers: User[] = [];

  filter = new FormGroup({
    users: new FormControl<NonNullable<User[]>>([]),
    projects: new FormControl<NonNullable<Project[]>>([]),
  });

  readonly filterValue$ = this.filter.valueChanges as Observable<{ users: User[]; projects: Project[] }>;

  private readonly reload$ = new Subject<void>();

  private readonly planning$ = new BehaviorSubject<Planning[]>([]);

  private readonly plannedDays$: Observable<{ date: Date; plannings: Planning[] }[]> = combineLatest([
    this.dateRange$,
    this.planning$,
    this.filterValue$.pipe(startWith({ users: [], projects: [] })),
    this.weekendVisibilityValue$.pipe(startWith({ saturday: true, sunday: true })),
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
    this.projects$,
    this.users$,
    this.plannedDays$,
    this.dateRange$,
  ]).pipe(
    map(([projectOptions, usersOptions, plannedDays, dateRange]) => ({
      plannedDays,
      projectOptions,
      userOptions: usersOptions,
      dateRange,
    })),
  );

  constructor(
    private readonly http: HttpClient,
    private readonly projectService: ProjectService,
    private readonly businessService: BusinessService,
  ) {
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
              } as Planning),
          ),
        ),
        untilDestroyed(this),
      )
      .subscribe(r => {
        this.planning$.next(r);
      });
  }

  getDateRange(): { start: Date; end: Date } {
    return this.dateRange$.value as { start: Date; end: Date };
  }

  previousDay(): void {
    const dateRange = this.getDateRange();
    dateRange.start = subWeeks(dateRange.start, 1);
    dateRange.end = subWeeks(dateRange.end, 1);
    this.dateRange$.next(dateRange);
  }

  nextDay(): void {
    const dateRange = this.getDateRange();
    dateRange.start = addWeeks(dateRange.start, 1);
    dateRange.end = addWeeks(dateRange.end, 1);
    this.dateRange$.next(dateRange);
  }

  addPlanning(date: Date, projectId: number): void {
    const plannings = this.planning$.value;
    const projectToAdd = this.selectedProjects.find(project => project.id === projectId);
    this.http
      .post<number>(PlanningEndpoints.CREATE(date, projectId), null)
      .pipe(take(1))
      .subscribe(
        (planningId: number) => {
          console.log('New Planning ID', planningId);
          if (projectToAdd) {
            plannings.push({
              users: [],
              id: planningId,
              project: projectToAdd,
              date,
            });
            this.planning$.next(plannings);
          }
          // this.planning$.next(plannings);
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
          alert('ERROR DELETE PLANNING');
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
            // this.reload$.next();
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
          // this.reload$.next();
        },
        () => {
          alert('ERROR SAVING PLANNING PROJECT TO DAY');
        },
      );
  }
}
