import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivmsgComponent } from './privmsg.component';

describe('PrivmsgComponent', () => {
  let component: PrivmsgComponent;
  let fixture: ComponentFixture<PrivmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivmsgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
