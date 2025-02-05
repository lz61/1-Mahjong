import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiBattleComponent } from './ai-battle.component';

describe('AiBattleComponent', () => {
  let component: AiBattleComponent;
  let fixture: ComponentFixture<AiBattleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiBattleComponent]
    });
    fixture = TestBed.createComponent(AiBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
