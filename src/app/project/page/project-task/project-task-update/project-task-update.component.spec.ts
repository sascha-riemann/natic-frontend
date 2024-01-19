import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskUpdateComponent } from './project-task-update.component';

describe('ProjectTaskUpdateComponent', () => {
  let component: ProjectTaskUpdateComponent;
  let fixture: ComponentFixture<ProjectTaskUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectTaskUpdateComponent]
    });
    fixture = TestBed.createComponent(ProjectTaskUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
