import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { addDays, addHours, endOfWeek, startOfWeek, subDays } from 'date-fns';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { combineLatest, filter, map, shareReplay, startWith, Subject, switchMap, take, tap } from 'rxjs';

import { TimesheetEntryDto, TimesheetEntryForm, TimesheetSegment } from '../../dto/timesheet-entry.dto';
import { GET_CATEGORY_TITLE, TimesheetEntryCategory } from '../../model/timesheet-entry-category';
import { TimesheetEntryService } from '../../service/timesheet-entry.service';

export interface TimesheetTab extends MenuItem {
  timesheetSegment: TimesheetSegment;
}

@UntilDestroy()
@Component({
  selector: 'app-timesheet-overview',
  templateUrl: './timesheet-overview.component.html',
  styleUrls: ['./timesheet-overview.component.scss'],
})
export class TimesheetOverviewComponent {
  private readonly timesheetService = inject(TimesheetEntryService);

  private readonly reload$ = new Subject<void>();

  readonly currentWeekRange = [
    startOfWeek(new Date(), {
      weekStartsOn: 1,
    }),
    endOfWeek(new Date(), {
      weekStartsOn: 1,
    }),
  ];

  readonly timesheetEntryForm = new FormControl<TimesheetEntryForm>({
    start: new Date(),
    end: addHours(new Date(), 1),
    fullWorkDay: false,
    category: TimesheetEntryCategory.WORK,
  });

  readonly dateRange = new FormControl<Date[]>(this.currentWeekRange);

  readonly timesheet$ = combineLatest([
    this.dateRange.valueChanges.pipe(
      filter(dateRange => !!dateRange![0]! && !!dateRange![1]),
      startWith(this.currentWeekRange),
    ),
    this.reload$.pipe(startWith(null)),
  ]).pipe(
    switchMap(([dateRange]) => this.timesheetService.getTimesheet(dateRange![0], dateRange![1])),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  workTime$ = this.timesheet$.pipe(map(timesheet => timesheet.workTimePerDay));

  constructor(private readonly confirmationService: ConfirmationService) {
    this.timesheetEntryForm.valueChanges
      .pipe(
        tap(result => console.log('Result', result)),
        switchMap(timesheetEntryForm => this.timesheetService.postTimesheetEntry(timesheetEntryForm as TimesheetEntryForm)),
        untilDestroyed(this),
      )
      .subscribe(() => this.reload$.next());
  }

  lastWeek(): void {
    const range = this.dateRange.value;
    if (range?.length && range?.length === 2) {
      this.dateRange.setValue([subDays(range[0], 7), subDays(range[1], 7)]);
    }
  }

  nextWeek(): void {
    const range = this.dateRange.value;
    if (range?.length && range?.length === 2) {
      this.dateRange.setValue([addDays(range[0], 7), addDays(range[1], 7)]);
    }
  }

  addEntry(date: Date, timesheetEntries: TimesheetEntryDto[]): void {
    const timesheetEntry = timesheetEntries[timesheetEntries.length - 1];

    if (timesheetEntry) {
      this.timesheetEntryForm.setValue(
        {
          ...timesheetEntry,
          id: undefined,
          start: timesheetEntry?.end ? new Date(timesheetEntry.end) : undefined,
          end: timesheetEntry?.end ? addHours(new Date(timesheetEntry.end), 1) : undefined,
          projectId: timesheetEntry.project?.id,
        },
        {
          emitEvent: false,
        },
      );
    } else {
      const formDate = new Date(date);
      formDate.setHours(8); // TODO: Was macht das hier?
      this.timesheetEntryForm.setValue(
        {
          start: formDate,
          end: addHours(formDate, 1),
          category: TimesheetEntryCategory.WORK,
          fullWorkDay: false,
        },
        {
          emitEvent: false,
        },
      );
    }
  }

  editEntry(timesheetEntry: TimesheetEntryDto): void {
    this.timesheetEntryForm.setValue(
      {
        ...timesheetEntry,
        start: timesheetEntry?.start ? new Date(timesheetEntry.start) : undefined,
        end: timesheetEntry?.end ? new Date(timesheetEntry.end) : undefined,
      },
      {
        emitEvent: false,
      },
    );
  }

  deleteEntry(event: Event, entryId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Möchten sie diesen Eintrag wirklich löschen?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
      accept: () => {
        this.timesheetService
          .deleteTimesheetEntry(entryId)
          .pipe(take(1))
          .subscribe(() => {
            this.reload$.next();
          });
      },
    });
  }

  protected readonly GET_CATEGORY_NAME = GET_CATEGORY_TITLE;
}
