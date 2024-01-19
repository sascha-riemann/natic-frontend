import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputErrorHintComponent } from './input-error-hint.component';

describe('InputErrorHintComponent', () => {
  let component: InputErrorHintComponent;
  let fixture: ComponentFixture<InputErrorHintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputErrorHintComponent]
    });
    fixture = TestBed.createComponent(InputErrorHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
