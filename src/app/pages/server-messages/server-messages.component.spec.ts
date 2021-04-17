import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerMessagesComponent } from './server-messages.component';

describe('ServerMessagesComponent', () => {
  let component: ServerMessagesComponent;
  let fixture: ComponentFixture<ServerMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
