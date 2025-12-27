import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowanceOtManagement } from './allowance-ot-management';

describe('AllowanceOtManagement', () => {
  let component: AllowanceOtManagement;
  let fixture: ComponentFixture<AllowanceOtManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllowanceOtManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowanceOtManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
