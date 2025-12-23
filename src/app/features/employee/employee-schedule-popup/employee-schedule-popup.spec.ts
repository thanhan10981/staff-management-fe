import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSchedulePopup } from './employee-schedule-popup';

describe('EmployeeSchedulePopup', () => {
  let component: EmployeeSchedulePopup;
  let fixture: ComponentFixture<EmployeeSchedulePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSchedulePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSchedulePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
