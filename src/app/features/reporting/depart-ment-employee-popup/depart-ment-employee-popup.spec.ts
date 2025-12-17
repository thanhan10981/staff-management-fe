import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartMentEmployeePopupComponent } from './depart-ment-employee-popup';

describe('DepartMentEmployeePopup', () => {
  let component: DepartMentEmployeePopupComponent;
  let fixture: ComponentFixture<DepartMentEmployeePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartMentEmployeePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartMentEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
