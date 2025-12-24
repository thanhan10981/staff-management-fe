import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogUser } from './system-log-user';

describe('SystemLogUser', () => {
  let component: SystemLogUser;
  let fixture: ComponentFixture<SystemLogUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLogUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLogUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
