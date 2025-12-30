import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSwapRequest } from './shift-swap-request';

describe('ShiftSwapRequest', () => {
  let component: ShiftSwapRequest;
  let fixture: ComponentFixture<ShiftSwapRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftSwapRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftSwapRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
