import { Component, EventEmitter, forwardRef, inject, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { addDays, addHours, differenceInDays, formatDuration, Interval, intervalToDuration, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { combineLatest, map, Observable, startWith, take, tap } from 'rxjs';

import { ProjectService } from '../../../project/service/project.service';
import { TimesheetEntryForm } from '../../dto/timesheet-entry.dto';
import {
  GET_CATEGORY_TITLE,
  IS_FULL_DAY_ONLY,
  IS_PROJECT_POSSIBLE,
  IS_PROJECT_REQUIRED,
  TIMESHEET_CATEGORIES,
  TimesheetEntryCategory,
} from '../../model/timesheet-entry-category';

@UntilDestroy()
@Component({
  selector: 'app-timesheet-entry-form',
  templateUrl: './timesheet-entry-form.component.html',
  styleUrls: ['./timesheet-entry-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimesheetEntryFormComponent),
      multi: true,
    },
  ],
})
export class TimesheetEntryFormComponent implements ControlValueAccessor {
  readonly projectService = inject(ProjectService);

  timesheetEntryFormId?: number;

  readonly formGroup = new FormGroup({
    category: new FormControl<TimesheetEntryCategory>(Object.keys(TIMESHEET_CATEGORIES)[0] as TimesheetEntryCategory, [
      Validators.required,
    ]),
    projectId: new FormControl<number | undefined>(undefined, [Validators.required]),
    fullWorkDay: new FormControl(false, [Validators.required]),
    start: new FormControl(new Date(), [Validators.required]),
    end: new FormControl(addHours(new Date(), 1), [Validators.required]),
    description: new FormControl<string | undefined>(undefined),
  });

  readonly fullDay$ = this.formGroup.get('fullWorkDay')!.valueChanges as Observable<boolean>;

  readonly projects$ = this.projectService.getProjects();

  onChange?: (timesheetEntryForm: TimesheetEntryForm) => void;
  onTouch?: (timesheetEntryForm: TimesheetEntryForm) => void;

  readonly timeCalculation$ = combineLatest([this.formGroup.valueChanges, this.fullDay$.pipe(startWith(false))]).pipe(
    map(([formValue, fullDay]) => {
      let interval: Interval | undefined;

      const start = formValue.start as Date;
      const end = formValue.end as Date;

      if ((!start && !end) || (fullDay && !this.workTimePerDay)) {
        return undefined;
      }

      if (fullDay && this.workTimePerDay) {
        const date = new Date();
        const daysDifference = differenceInDays(startOfDay(end), startOfDay(start));
        interval = {
          start: date,
          end: addDays(date, daysDifference),
        };
      } else {
        interval = { start, end };
      }

      const duration = intervalToDuration(interval);
      const time = formatDuration(duration, {
        format: ['days', 'hours', 'minutes'],
        delimiter: ', ',
        locale: de,
      });

      const categoryName = GET_CATEGORY_TITLE(formValue.category!);

      return `<strong>${time}</strong> für die Kategorie <strong>${categoryName}</strong> verbuchen`;
    }),
  );

  @Input() workTimePerDay?: number | undefined | null;

  @Output() created = new EventEmitter<void>();

  constructor() {
    this.projects$.pipe(take(1)).subscribe(projects => {
      this.formGroup.get('projectId')?.setValue(projects[0]?.id);
    });

    this.formGroup
      .get('category')
      ?.valueChanges.pipe(
        map(category => category as TimesheetEntryCategory),
        untilDestroyed(this),
      )
      .subscribe(category => {
        const fullDayControl = this.formGroup.get('fullWorkDay') as FormControl;
        const fullDayOnly = IS_FULL_DAY_ONLY(category);

        const projectControl = this.formGroup.get('projectId') as FormControl;
        const isProjectPossible = IS_PROJECT_POSSIBLE(category);
        const isProjectRequired = IS_PROJECT_REQUIRED(category);

        if (!this.workTimePerDay) {
          fullDayControl.setValue(false, { emitEvent: false });
          fullDayControl.disable();
        } else if (fullDayOnly) {
          fullDayControl.setValue(true, { emitEvent: false });
          fullDayControl.disable();
        } else {
          fullDayControl.enable();
        }

        if (!isProjectPossible) {
          projectControl.setValidators([]);
          projectControl.disable();
          projectControl.setValue(null, { emitEvent: false });
        } else if (isProjectRequired) {
          projectControl.enable();
          projectControl.setValidators([Validators.required]);
        } else {
          projectControl.enable();
          projectControl.setValidators([]);
        }
      });
  }

  registerOnChange(fn: (timesheetEntryForm: TimesheetEntryForm) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (timesheetEntryForm: TimesheetEntryForm) => void): void {
    this.onTouch = fn;
  }

  writeValue(timesheetEntryForm: TimesheetEntryForm): void {
    this.timesheetEntryFormId = timesheetEntryForm?.id;
    this.formGroup.patchValue(timesheetEntryForm);
  }

  cancel(): void {
    this.formGroup.reset();
  }

  save(): void {
    if (this.formGroup.valid) {
      const result: TimesheetEntryForm = {
        id: this.timesheetEntryFormId,
        category: this.formGroup.value.category!,
        description: this.formGroup.value.description as string | undefined,
        fullWorkDay: this.formGroup.value.fullWorkDay as boolean,
        start: this.formGroup.value.start!,
        end: this.formGroup.value.end!,
        projectId: this.formGroup.value.projectId as number | undefined,
      };
      this.onTouch?.(result);
      this.onChange?.(result);
    }
  }

  protected readonly TIMESHEET_CATEGORIES = TIMESHEET_CATEGORIES;
  protected readonly Object = Object;
  protected readonly GET_CATEGORY_TITLE = GET_CATEGORY_TITLE;
}
