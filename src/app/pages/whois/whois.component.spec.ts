import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoisComponent } from './whois.component';

describe('WhoisComponent', () => {
  let component: WhoisComponent;
  let fixture: ComponentFixture<WhoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
