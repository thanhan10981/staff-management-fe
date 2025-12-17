import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbroadFlash } from './dashbroad-flash';

describe('DashbroadFlash', () => {
  let component: DashbroadFlash;
  let fixture: ComponentFixture<DashbroadFlash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbroadFlash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbroadFlash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
