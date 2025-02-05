import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WargameComponent } from './wargame.component';

describe('WargameComponent', () => {
  let component: WargameComponent;
  let fixture: ComponentFixture<WargameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WargameComponent]
    });
    fixture = TestBed.createComponent(WargameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
