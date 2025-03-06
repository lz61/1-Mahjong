import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { AiBattleComponent } from './ai-battle/ai-battle.component';
import { PlayerBattleComponent } from './player-battle/player-battle.component';
import { WargameComponent } from './wargame/wargame.component';
import { HexMapComponent } from './wargame/hex-map/hex-map.component';

const routes: Routes = [
  { path: '', redirectTo: '/wargame', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'game', component: GameComponent,
    children: [
      { path: 'ai-battle', component: AiBattleComponent }, // 人机对战页面
      { path: 'player-battle', component: PlayerBattleComponent }, // 人人对战页面
    ]
  },
  { path: 'chat', component: ChatComponent},
  { path: 'wargame', component:WargameComponent},
  { path: 'hex-map', component:HexMapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
