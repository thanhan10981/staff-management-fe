import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAuditPopup } from './employee-audit-popup';

describe('EmployeeAuditPopup', () => {
  let component: EmployeeAuditPopup;
  let fixture: ComponentFixture<EmployeeAuditPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAuditPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAuditPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
