import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdministrationComponent } from './system-administration';

describe('SystemAdministration', () => {
  let component: SystemAdministrationComponent;
  let fixture: ComponentFixture<SystemAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
