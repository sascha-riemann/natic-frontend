import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPageCreateProjectComponent } from './planning-page-create-project.component';

describe('PlanningPageCreateProjectComponent', () => {
  let component: PlanningPageCreateProjectComponent;
  let fixture: ComponentFixture<PlanningPageCreateProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningPageCreateProjectComponent]
    });
    fixture = TestBed.createComponent(PlanningPageCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
