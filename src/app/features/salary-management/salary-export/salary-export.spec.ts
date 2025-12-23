import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryExport } from './salary-export';

describe('SalaryExport', () => {
  let component: SalaryExport;
  let fixture: ComponentFixture<SalaryExport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryExport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryExport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
