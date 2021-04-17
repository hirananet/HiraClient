import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalesComponent } from './canales.component';

describe('CanalesComponent', () => {
  let component: CanalesComponent;
  let fixture: ComponentFixture<CanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
