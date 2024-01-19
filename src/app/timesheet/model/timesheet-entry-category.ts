export interface TimesheetEntryCategoryOptions {
  title: string;
  fullDayOnly: boolean;
  projectPossible: boolean;
  projectRequired: boolean;
}

export enum TimesheetEntryCategory {
  WORK = 'WORK',
  BREAK = 'BREAK',
  VACATION = 'URLAUB',
  ILLNESS = 'ILLNESS',
  TRAVEL = 'TRAVEL',
  TRAINING_EDUCATION = 'TRAINING_EDUCATION',
  HOLIDAYS = 'HOLIDAYS',
  OTHER = 'OTHER',
}

export const TIMESHEET_CATEGORIES: Record<TimesheetEntryCategory, TimesheetEntryCategoryOptions> = {
  [TimesheetEntryCategory.WORK]: {
    title: 'Arbeit',
    fullDayOnly: false,
    projectRequired: true,
    projectPossible: true,
  },
  [TimesheetEntryCategory.BREAK]: {
    title: 'Pause',
    fullDayOnly: false,
    projectRequired: false,
    projectPossible: false,
  },
  [TimesheetEntryCategory.VACATION]: {
    title: 'Urlaub',
    fullDayOnly: false,
    projectRequired: false,
    projectPossible: false,
  },
  [TimesheetEntryCategory.ILLNESS]: {
    title: 'Krankheit',
    fullDayOnly: true,
    projectRequired: false,
    projectPossible: false,
  },
  [TimesheetEntryCategory.TRAVEL]: {
    title: 'Reise',
    fullDayOnly: false,
    projectRequired: false,
    projectPossible: true,
  },
  [TimesheetEntryCategory.TRAINING_EDUCATION]: {
    title: 'Schulungen und Fortbildungen',
    fullDayOnly: false,
    projectRequired: false,
    projectPossible: false,
  },
  [TimesheetEntryCategory.HOLIDAYS]: {
    title: 'Feiertage',
    fullDayOnly: true,
    projectRequired: false,
    projectPossible: false,
  },
  [TimesheetEntryCategory.OTHER]: {
    title: 'Sonstige Zeiten',
    fullDayOnly: false,
    projectRequired: false,
    projectPossible: true,
  },
};

export const GET_CATEGORY_TITLE = (category: TimesheetEntryCategory): string => {
  return TIMESHEET_CATEGORIES[category].title;
};

export const IS_FULL_DAY_ONLY = (category: TimesheetEntryCategory): boolean => {
  return TIMESHEET_CATEGORIES[category].fullDayOnly;
};

export const IS_PROJECT_POSSIBLE = (category: TimesheetEntryCategory): boolean => {
  return TIMESHEET_CATEGORIES[category].projectPossible;
};

export const IS_PROJECT_REQUIRED = (category: TimesheetEntryCategory): boolean => {
  return TIMESHEET_CATEGORIES[category].projectRequired;
};
