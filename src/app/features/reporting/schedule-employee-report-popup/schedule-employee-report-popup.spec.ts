import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleEmployeeReportPopup } from './schedule-employee-report-popup';

describe('ScheduleEmployeeReportPopup', () => {
  let component: ScheduleEmployeeReportPopup;
  let fixture: ComponentFixture<ScheduleEmployeeReportPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleEmployeeReportPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleEmployeeReportPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
