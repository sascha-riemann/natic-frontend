import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUsersComponent } from './business-users.component';

describe('BusinessUsersComponent', () => {
  let component: BusinessUsersComponent;
  let fixture: ComponentFixture<BusinessUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessUsersComponent],
    });
    fixture = TestBed.createComponent(BusinessUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
