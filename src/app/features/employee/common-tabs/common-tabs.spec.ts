import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTabs } from './common-tabs';

describe('CommonTabs', () => {
  let component: CommonTabs;
  let fixture: ComponentFixture<CommonTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
