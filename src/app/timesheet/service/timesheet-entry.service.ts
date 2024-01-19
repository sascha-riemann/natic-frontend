import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Timesheet, TimesheetEntryForm } from '../dto/timesheet-entry.dto';
import { TimesheetEndpoints } from '../timesheet.module';

@Injectable({
  providedIn: 'root',
})
export class TimesheetEntryService {
  constructor(private readonly http: HttpClient) {}

  postTimesheetEntry(dto: TimesheetEntryForm): Observable<void> {
    return this.http.post<void>(TimesheetEndpoints.FORM, dto);
  }

  getTimesheet(start: Date, end: Date): Observable<Timesheet> {
    return this.http.get<Timesheet>(TimesheetEndpoints.GET(start, end));
  }

  deleteTimesheetEntry(id: number): Observable<void> {
    return this.http.delete<void>(TimesheetEndpoints.DELETE_ENTRY(id));
  }
}
