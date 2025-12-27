import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHealthPopup } from './employee-health-popup';

describe('EmployeeHealthPopup', () => {
  let component: EmployeeHealthPopup;
  let fixture: ComponentFixture<EmployeeHealthPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeHealthPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeHealthPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
