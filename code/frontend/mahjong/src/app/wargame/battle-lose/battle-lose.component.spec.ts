import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleLoseComponent } from './battle-lose.component';

describe('BattleLoseComponent', () => {
  let component: BattleLoseComponent;
  let fixture: ComponentFixture<BattleLoseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BattleLoseComponent]
    });
    fixture = TestBed.createComponent(BattleLoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
