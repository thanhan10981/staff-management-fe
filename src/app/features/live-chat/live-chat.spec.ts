import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChatPopupComponent } from './live-chat';

describe('AppLiveChatPopup', () => {
  let component: LiveChatPopupComponent;
  let fixture: ComponentFixture<LiveChatPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveChatPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveChatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
