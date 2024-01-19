import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResourceCategoryFormComponent } from './dialog-resource-category-form.component';

describe('DialogResourceCategoryFormComponent', () => {
  let component: DialogResourceCategoryFormComponent;
  let fixture: ComponentFixture<DialogResourceCategoryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogResourceCategoryFormComponent]
    });
    fixture = TestBed.createComponent(DialogResourceCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
