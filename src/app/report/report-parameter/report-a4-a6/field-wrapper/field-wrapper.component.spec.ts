import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWrapperComponent } from './field-wrapper.component';

describe('CustomErrorFieldComponent', () => {
  let component: FieldWrapperComponent;
  let fixture: ComponentFixture<FieldWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
