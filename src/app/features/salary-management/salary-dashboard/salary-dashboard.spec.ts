import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDashboard } from './salary-dashboard';

describe('SalaryDashboard', () => {
  let component: SalaryDashboard;
  let fixture: ComponentFixture<SalaryDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
