import { TimesheetEntryCategory } from '../model/timesheet-entry-category';

export interface TimesheetEntryForm {
  id?: number;
  category: TimesheetEntryCategory;
  description?: string;
  fullWorkDay: boolean;
  start?: Date;
  end?: Date;
  projectId?: number;
}

export interface TimesheetEntryDto {
  id?: number;
  category: TimesheetEntryCategory;
  description?: string;
  fullWorkDay: boolean;
  start?: Date;
  end?: Date;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface TimesheetSegment {
  date: Date;
  workTime: number;
  breakTime: number;
  fullDayCategory?: TimesheetEntryCategory;
  entries: TimesheetEntryDto[];
}

export interface Timesheet {
  timesheetSegments: TimesheetSegment[];
  workTimePerDay?: number;
}
