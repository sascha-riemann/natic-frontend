import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskCreateComponent } from './project-task-create.component';

describe('ProjectTaskCreateComponent', () => {
  let component: ProjectTaskCreateComponent;
  let fixture: ComponentFixture<ProjectTaskCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectTaskCreateComponent]
    });
    fixture = TestBed.createComponent(ProjectTaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
