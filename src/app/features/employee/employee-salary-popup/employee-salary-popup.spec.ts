import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryPopup } from './employee-salary-popup';

describe('EmployeeSalaryPopup', () => {
  let component: EmployeeSalaryPopup;
  let fixture: ComponentFixture<EmployeeSalaryPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
