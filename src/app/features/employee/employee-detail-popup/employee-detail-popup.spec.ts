import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailPopup } from './employee-detail-popup';

describe('EmployeeDetailPopup', () => {
  let component: EmployeeDetailPopup;
  let fixture: ComponentFixture<EmployeeDetailPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetailPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
