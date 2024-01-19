import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetEntryFormComponent } from './timesheet-entry-form.component';

describe('TimesheetEntryFormComponent', () => {
  let component: TimesheetEntryFormComponent;
  let fixture: ComponentFixture<TimesheetEntryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetEntryFormComponent]
    });
    fixture = TestBed.createComponent(TimesheetEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
