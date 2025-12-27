import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaRequest } from './loa-request';

describe('LoaRequest', () => {
  let component: LoaRequest;
  let fixture: ComponentFixture<LoaRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
