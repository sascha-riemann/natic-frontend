import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSelectComponent } from './business-select.component';

describe('BusinessSelectComponent', () => {
  let component: BusinessSelectComponent;
  let fixture: ComponentFixture<BusinessSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessSelectComponent]
    });
    fixture = TestBed.createComponent(BusinessSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
