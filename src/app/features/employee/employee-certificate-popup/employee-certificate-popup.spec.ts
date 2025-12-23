import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCertificatePopup } from './employee-certificate-popup';

describe('EmployeeCertificatePopup', () => {
  let component: EmployeeCertificatePopup;
  let fixture: ComponentFixture<EmployeeCertificatePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCertificatePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCertificatePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
