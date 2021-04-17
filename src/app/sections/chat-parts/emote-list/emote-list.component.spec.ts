import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmoteListComponent } from './emote-list.component';

describe('EmoteListComponent', () => {
  let component: EmoteListComponent;
  let fixture: ComponentFixture<EmoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
