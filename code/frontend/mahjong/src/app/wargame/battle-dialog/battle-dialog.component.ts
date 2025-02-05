import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-battle-dialog',
  templateUrl: './battle-dialog.component.html',
  styleUrls: ['./battle-dialog.component.css']
})
export class BattleDialogComponent {
  // Ĭ��battleRound = 5
  battleRound: number = 5;
  // 
  battleTarget: string = "Kill all enemies!";

  failureCondition: string = "Lose all units!";

  close(){
    // �رն�
    this.dialogRef.close();
  }

  constructor(public dialogRef: MatDialogRef<BattleDialogComponent>) { }
}
