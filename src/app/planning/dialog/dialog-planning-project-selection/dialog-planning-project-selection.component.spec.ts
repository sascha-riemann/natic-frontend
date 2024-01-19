import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPlanningProjectSelectionComponent } from './dialog-planning-project-selection.component';

describe('DialogPlanningProjectSelectionComponent', () => {
  let component: DialogPlanningProjectSelectionComponent;
  let fixture: ComponentFixture<DialogPlanningProjectSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPlanningProjectSelectionComponent]
    });
    fixture = TestBed.createComponent(DialogPlanningProjectSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
