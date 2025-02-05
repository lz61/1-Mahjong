import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBattleComponent } from './player-battle.component';

describe('PlayerBattleComponent', () => {
  let component: PlayerBattleComponent;
  let fixture: ComponentFixture<PlayerBattleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerBattleComponent]
    });
    fixture = TestBed.createComponent(PlayerBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
