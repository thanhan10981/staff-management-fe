import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAllowanceReport } from './salary-allowance-report';

describe('SalaryAllowanceReport', () => {
  let component: SalaryAllowanceReport;
  let fixture: ComponentFixture<SalaryAllowanceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryAllowanceReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryAllowanceReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
