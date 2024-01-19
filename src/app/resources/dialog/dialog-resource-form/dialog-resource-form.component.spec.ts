import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResourceFormComponent } from './dialog-resource-form.component';

describe('DialogResourceFormComponent', () => {
  let component: DialogResourceFormComponent;
  let fixture: ComponentFixture<DialogResourceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogResourceFormComponent]
    });
    fixture = TestBed.createComponent(DialogResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
