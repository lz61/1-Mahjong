import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';  // 导入 ReactiveFormsModule
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { AiBattleComponent } from './ai-battle/ai-battle.component';
import { PlayerBattleComponent } from './player-battle/player-battle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { WargameComponent } from './wargame/wargame.component';
import { HexMapComponent } from './wargame/hex-map/hex-map.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BattleDialogComponent } from './wargame/battle-dialog/battle-dialog.component';
import { BattleLoseComponent } from './wargame/battle-lose/battle-lose.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    GameComponent,
    ChatComponent,
    AiBattleComponent,
    PlayerBattleComponent,
    WargameComponent,
    HexMapComponent,
    BattleDialogComponent,
    BattleLoseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  // 导入 FormsModule
    ReactiveFormsModule, BrowserAnimationsModule,  // 导入 ReactiveFormsModule
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
