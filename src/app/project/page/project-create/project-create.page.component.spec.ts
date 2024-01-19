import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreatePageComponent } from './project-create.page.component';

describe('ProjectCreateComponent', () => {
  let component: ProjectCreatePageComponent;
  let fixture: ComponentFixture<ProjectCreatePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCreatePageComponent]
    });
    fixture = TestBed.createComponent(ProjectCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
