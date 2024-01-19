import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSaveComponent } from './cancel-save.component';

describe('CancelSaveComponent', () => {
  let component: CancelSaveComponent;
  let fixture: ComponentFixture<CancelSaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelSaveComponent]
    });
    fixture = TestBed.createComponent(CancelSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
