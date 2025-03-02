import { Component,HostListener, OnInit } from '@angular/core';
import { City, Hexagon } from './hexagon';
import { Unit } from './unit';
import { MatDialog } from '@angular/material/dialog';
import { BattleDialogComponent } from '../battle-dialog/battle-dialog.component';
import { guderian } from './general';

@Component({
  selector: 'app-hex-map',
  templateUrl: './hex-map.component.html',
  styleUrls: ['./hex-map.component.css']
})
export class HexMapComponent implements OnInit {
  mapWidth: number = 1000; // 地图的宽度
  mapHeight: number = 1000; // 地图的高度
  hexagons: Hexagon[] = []; // 存储所有六边形
  hexSize: number = 60; // 六边形的边长
  selectedHex: Hexagon | null = null; // 当前选中的地块
  moveAbleSpotColor = 'green'; // 可移动地块的颜色
  hexagonColor = 'gray'; // 默认地块的颜色
  lowUnitColor = 'red'; // 高血量兵种的颜色
  currentTurn: 'player' | 'ai' = 'player'; // 当前回合，默认为玩家回合
  playerCamp = Unit.playerCamp;
  aiCamp = Unit.aiCamp;
  playerMoney: number = 5;
  playerCampColor = 'black';
  aiCampColor = 'white';
  mapWidthMagFac = 0.8;
  mapHeightMagFac = 0.9;
  littleRound = 1;
  bigRound = 1;
  turnCount = 1;
  totalTurnCount = 5;

  generals = [
    guderian,
  //   { name: 'rommel', image: 'assets/generals/rommel.png',
  // skillDescription: 'Tank add 3 attack at first turn' },
  //   {
  //     name: 'manstein', image: 'assets/generals/manstein.png',
  //     skillDescription: 'Tank add 10 attack at last turn'
  //   },
  ];
  tellThingsAboutGame(){
    console.log("正在施工中......"); 
  }
  // 控制侧边栏的开关
  isSidebarOpen = true;
  ngOnInit(): void {
    this.updateMapSize(); // 初始化时更新地图大小
    const row = this.mapWidth / (this.hexSize);
    const col = this.mapHeight / (this.hexSize / 2);
    this.generateHexMap(row, col); // 创建 10x10 的蜂巢
    // 声音
    // const audio = document.getElementById('background-music') as HTMLAudioElement;
    // audio.muted = false; // 取消静音
    // audio.play().catch(error => console.log('Error playing music:', error));

    // 在开始战斗时,弹出对话框,显示:
    // 战斗回合数
    // 战斗目标
    // 失败条件
    // 在开始战斗时弹出对话框
    this.openBattleDialog();
    this.startPlayerTurn(); 
  }

  checkGeneralEffect(){
    // 对于每个将军,调用其增益技能
    
  }

  // 切换侧边栏的显示状态
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  hoveredGeneral: any = null; // 当前悬停的将领
  tooltipStyle = { top: '0px', left: '0px',width:'0px' }; // 提示框位置

  activeGeneral: any = null; // 当前显示技能的将领



  openBattleDialog() {
    this.dialog.open(BattleDialogComponent);
  }

  showGeneralSkill(general: any,event: MouseEvent) {
    console.log("Mouse moved in");
    console.log(general.skillDescription);
    this.hoveredGeneral = general;
    const tooltipWidth = 150; // 说明框的宽度（假设为 150px）
    const generalWidth = 50; // 将领头像的宽度（固定为 50px）
    const offsetY = 1000; // 垂直偏移量（10cm ≈ 100px）

    this.tooltipStyle = {
      top: `${event.clientY + offsetY}px`,
      left: `${event.clientX - (tooltipWidth - generalWidth) / 2}px`,
      width: `${tooltipWidth}px` // 设置说明框的宽度
    };
  }

  hideGeneralSkill() {
    this.hoveredGeneral = null;
  }

  constructor(private dialog: MatDialog) { }

  updatePlayerMoney(amount: number): void {
    this.playerMoney += amount;
    console.log(`玩家金钱更新: 当前金钱数为 ${this.playerMoney}`);
  }

  getHealthBarColor(currentHealth: number, maxHealth: number): string {
    const healthPercentage = (currentHealth / maxHealth) * 100;
    if (healthPercentage > 50) {
      return 'green'; // 高血量：绿色
    } else if (healthPercentage > 25) {
      return 'yellow'; // 中血量：黄色
    } else {
      return this.lowUnitColor; // 低血量：红色
    }
  }


  getAllMoveAbleSpots(hex: Hexagon): Hexagon[] {
    var hexList = [];
    for (let hexagon of this.hexagons) {
      if(hex.unit && this.isReachable(hexagon,hex, hex.unit.movementSpeed)){
        hexList.push(hexagon);
      }
    }
    return hexList;
  }

  getAvailablePlayerUnits(): Hexagon[] {
    return this.hexagons.filter((hex) => hex.unit && hex.unit.camp === Unit.playerCamp && (!hex.unit.hasMoved || hex.unit.canAttack));
  }

  getPlayerUnits():Unit[]{
    var hexList = this.hexagons.filter((hex) => hex.unit && hex.unit.camp === Unit.playerCamp)
    var unitList:Unit[] = [];
    for(let hex of hexList){
      if(hex.unit)
        unitList.push(hex.unit);
    }
    return unitList;
  }


  highlightAvailableUnits(): void {
    const availableUnits = this.getAvailablePlayerUnits();
    for (const hex of availableUnits) {
      if (!hex.unit?.hasMoved) {
        hex.color = 'yellow'; // 高亮可移动单位
      }
      if (hex.unit?.canAttack) {
        hex.color = 'red'; // 高亮可攻击单位
      }
    }
  }


  onHexClick(hex: Hexagon): void {
    // 如果当前回合为 AI 回合，则不允许玩家操作
    // 如果不是玩家回合，禁止操作
    if (this.currentTurn !== 'player') {
      console.log('当前是 AI 回合，无法操作。');
      return;
    }

    // 如果点击的单位已攻击，禁止操作
    if (hex.unit && hex.unit.hasAttacked) {
      console.log('该单位已经在本回合中攻击过，无法再移动或攻击。');
      return;
    }




    // 五种情况:
    // 未选中地块: 调整当前地块为已选中地块
    // 已选中地块且选中的地块上无兵种: 取消选中
    // 已选中地块且该地块上有兵且选中地块为该兵可移动到的地块(不允许攻击): 将兵从已选中地块移动到当前地块
    // 已选中地块且该地块上有兵且选中地为该兵可攻击到的地块: 兵种原地攻击
    // 已选中地块且该地块上有兵且选中地块不为该兵可抵达地块: 取消选中

    // 未选中地块
    if (this.selectedHex === null) {
      for (let hexagon of this.hexagons) {
        if (hexagon.color === 'green'|| hexagon.color === 'yellow') {
          hexagon.color = this.hexagonColor;
        }
      }
      // 如果点击的单位不属于玩家阵营，禁止操作
      if (hex.unit && hex.unit.camp !== Unit.playerCamp) {
        console.log("当前的单位的阵营是:", hex.unit.camp);
        console.log('无法操作敌方单位。');
        return;
      }
      // 选中地块
      this.selectedHex = hex;
      // 调整颜色
      hex.color = 'yellow';
      // 显示该兵种可抵达地块与可攻击地块
      if(hex.unit===null) return;
      // 已攻击则不显示
      if(hex.unit.hasAttacked === true) return;
      // 未攻击，显示可攻击地块
      this.selectedHex.getNodesInDistance(hex.x,hex.y,this.hexSize,hex.unit.attackRange).forEach(hex => {
        // 让所有(x,y)对应的地块颜色显示为红色
        const realHex = this.getHexagon(hex.x, hex.y);
        if(realHex === null || realHex.unit === null || realHex.unit.camp == this.selectedHex?.unit?.camp) return;
        realHex.color = 'cyan';
      });
      // 已移动则不显示
      if(hex.unit.hasMoved === true) return;
      this.selectedHex.getNodesInDistance(hex.x,hex.y,this.hexSize,hex.unit.movementSpeed).forEach(hex => {
        // 让所有(x,y)对应的地块颜色显示为绿色
        const realHex = this.getHexagon(hex.x, hex.y);
        if(realHex === null) return;
        realHex.color = this.moveAbleSpotColor;

        // hex.color = this.moveAbleSpotColor;
      });

      return;
    }

    // 已选中地块且选中的地块上无兵种: 取消选中
    if (this.selectedHex !== null && this.selectedHex.unit === null) {
      this.selectedHex.color = this.hexagonColor;
      this.selectedHex = null;
      for (let hexagon of this.hexagons) {
        if (hexagon.color === 'green'|| hexagon.color === 'yellow') {
          hexagon.color = this.hexagonColor;
        }
      }
      return;
    }

    // 已选中地块且原先选中的地块上有兵且新选中地块为该兵可移动到的地块(不允许攻击): 将兵从已选中地块移动到当前地块
    // 改成: 移动归移动,攻击归攻击的形式

    // 兵种移动和攻击的判定
    if (
      this.selectedHex !== null &&
      this.selectedHex.unit &&
      this.isReachable(hex, this.selectedHex, this.selectedHex.unit?.movementSpeed || 0) &&
      hex.unit === null
      ) {
      // 纯移动逻辑
        // 判断是否已经移动
        if (this.selectedHex.unit.hasMoved) {
          this.selectedHex.color = this.hexagonColor;
          this.selectedHex = null;
          console.log('该单位本回合已经移动过，无法再次移动。');
          return;
        }

        // 如果新地块为空，将兵种从已选中地块移动到新地块
        hex.unit = this.selectedHex.unit;

        if (this.selectedHex !== hex) {
          this.selectedHex.unit = null;
        }

        // 如果新地块上有城市，将城市的阵营设置为当前单位的阵营
        if (hex.city) {
          hex.city.camp = hex.unit.camp;
        }

        // 标记为已移动
        hex.unit.hasMoved = true;

        // 将显示的所有可移动到的地块颜色调整为默认颜色
        for (let hexagon of this.hexagons) {
          if (hexagon.color === 'green') {
            hexagon.color = this.hexagonColor;
          }
        }

        // 恢复选中地块的颜色并选中当前地块
        this.selectedHex.color = this.hexagonColor;
        this.selectedHex = hex;
        this.selectedHex.color = 'yellow';
        // 如果有能攻击到的地块，显示攻击范围
        this.selectedHex.getNodesInDistance(hex.x,hex.y,this.hexSize,hex.unit.attackRange).forEach(hex => {
          // 让所有(x,y)对应的地块颜色显示为红色
          const realHex = this.getHexagon(hex.x, hex.y);
          if(realHex === null || realHex.unit === null || realHex.unit.camp == this.selectedHex?.unit?.camp) return;
          realHex.color = 'cyan';
        });

        console.log('单位移动完成。');
        return;
    }

    // 已选中地块且该地块上有兵且选中地块为该兵可攻击到的地块: 兵种原地攻击
    if (this.selectedHex !== null &&
      this.selectedHex.unit &&
      this.isReachable(hex, this.selectedHex, this.selectedHex.unit?.attackRange || 0)
    ){
      // 攻击逻辑
      if (hex.unit !== null && hex.unit.camp !== this.selectedHex.unit.camp) {
        // 判断是否已经攻击
        if (this.selectedHex.unit.hasAttacked) {
          console.log('该单位本回合已经攻击过，无法再次攻击。');
          return;
        }

        // 执行攻击逻辑
        const damage = this.selectedHex.unit.attack(); // 获取随机攻击伤害
        hex.unit.takeDamage(damage); // 减少被攻击单位的血量

        console.log(`Unit at (${this.selectedHex.x}, ${this.selectedHex.y}) attacked unit at (${hex.x}, ${hex.y}) for ${damage} damage.`);

        // 标记为已攻击
        if (this.selectedHex.unit !== null)
          this.selectedHex.unit.hasAttacked = true;

        // 检查被攻击单位是否死亡
        if (hex.unit.health <= 0) {
          console.log(`Unit at (${hex.x}, ${hex.y}) died.`);
          hex.unit = null;
          // 如果被攻击单位死亡，则进攻方的攻击状态重置
          // 无限动大神
          this.selectedHex.unit.hasAttacked = false;
        } else {
          // 如果被攻击单位未死亡，则尝试反击
          const counterDamage = hex.unit.counterAttack();
          if (counterDamage > 0) {
            // 进攻方受到反击伤害
            this.selectedHex.unit?.takeDamage(counterDamage);
            console.log(
              `Unit at (${hex.x}, ${hex.y}) counterattacked unit at (${this.selectedHex.x}, ${this.selectedHex.y}) for ${counterDamage} damage.`
            );

            // 检查进攻方是否死亡
            if (this.selectedHex.unit?.health! <= 0) {
              console.log(`Unit at (${this.selectedHex.x}, ${this.selectedHex.y}) died.`);
              this.selectedHex.unit = null;
            }
          }
        }



        // 将显示的所有地块颜色调整为默认颜色
        for (let hexagon of this.hexagons) {
            hexagon.color = this.hexagonColor;
        }

        // 恢复选中地块的颜色并取消选中
        this.selectedHex.color = this.hexagonColor;
        this.selectedHex = null;

        console.log('单位攻击完成。');
        return;
      }
    }


    // 已选中地块且该地块上有兵且选中地块不为该兵可抵达地块
    
    if (this.selectedHex && this.selectedHex.unit && !this.isReachable(hex,this.selectedHex, this.selectedHex.unit.movementSpeed)) {
      // 取消选中
      this.selectedHex.color = this.hexagonColor;
      this.selectedHex = null;
      for (let hexagon of this.hexagons) {
        if (hexagon.color === 'green') {
          hexagon.color = this.hexagonColor;
        }
      }
      return;
    }
  }

  isReachable(hex: Hexagon,hex2: Hexagon,distance: number): boolean {
    const distanceHex = Math.sqrt(Math.pow(hex.x - hex2.x, 2) + Math.pow(hex.y - hex2.y, 2));
    return distanceHex <= distance * this.hexSize*2;
  }

  // 画圆,遍历所有六边形,判断是否在圆内
  reachAllNeighbors(hex: Hexagon, distance: number): void {
    for (let hexagon of this.hexagons) {
      if (this.isReachable(hexagon,hex, distance)) {
        hexagon.color = 'green';
      }
    }
  }

  isSameHex(hex: Hexagon, neighbor: { x: number; y: number }): boolean {
    const tolerance = 0.01;
    return (
      Math.abs(hex.x - neighbor.x) < tolerance &&
      Math.abs(hex.y - neighbor.y) < tolerance
    );
  }

  // getHexagon from x and y spot
  getHexagon(x: number, y: number): Hexagon | null {
    for (let hexagon of this.hexagons) {
      if (Math.abs(hexagon.x - x) < 0.01 && Math.abs(hexagon.y - y) < 0.01) {
        return hexagon;
      }
    }
    return null;
  }

  // getHexagonFromRowAndCol
  getHexagonFromRowAndCol(row: number, col: number): Hexagon | null {
    return this.getHexagon(row * 2 * this.hexSize * 3 / 2 + this.hexSize * 3 / 2,
      col * (Math.sqrt(3) * this.hexSize) + (Math.sqrt(3) * this.hexSize) / 2);
  }

  // 最好是通过存档文件初始化,现在有点sb
  // 读取小关与大关的数据,boost=(大关-1)*0.1+(小关-1)*0.07+1
  // boss战会很难打
  initAICamp(rows: number, cols: number): void {
    var boost = (this.bigRound-1)*0.1 + (this.littleRound-1)*0.07+1;
    var unit = null;
    // 读取文件内容:


    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if(row == 4 && col == 1){
          unit = Unit.createNormalInfantry(Unit.aiCamp,boost);
          var hexagon = this.getHexagonFromRowAndCol(row,col);
          if(hexagon !== null)
            hexagon.unit = unit;
        }
        if(row == 5 && col == 1){
          unit = Unit.createNormalInfantry(Unit.aiCamp,boost);
          var hexagon = this.getHexagonFromRowAndCol(row,col);
          if(hexagon !== null)
            hexagon.unit = unit;
        }
        if(row == 6 && col == 2){
          unit = Unit.createNormalInfantry(Unit.aiCamp, boost);
          var hexagon = this.getHexagonFromRowAndCol(row,col);
          if (hexagon !== null)
            hexagon.unit = unit;
        }
          
      }
    }
  }

  // 部署我方阵营(以后应该改成玩家自选)
  initPlayerCamp(rows: number, cols: number): void {
    var unit = null;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (row == 1 && col == 1) {
          // unit = Unit.createNormalCavalry();
          unit = Unit.createNormalUnit(Unit.playerCamp,'cavalry');
          var hexagon = this.getHexagon(row * 2 * this.hexSize * 3 / 2 + this.hexSize * 3 / 2, 
          col * (Math.sqrt(3) * this.hexSize) + (Math.sqrt(3) * this.hexSize) / 2);
          if (hexagon !== null)
            hexagon.unit = unit;
        }
        if (row == 3 && col == 6) {
          unit = Unit.createNormalUnit(Unit.playerCamp,'cavalry');
          var hexagon = this.getHexagon(row * 2 * this.hexSize * 3 / 2 + this.hexSize * 3 / 2, 
          col * (Math.sqrt(3) * this.hexSize) + (Math.sqrt(3) * this.hexSize) / 2);
          if (hexagon !== null)
            hexagon.unit = unit;
        }

      }
    }
  }

  

  rowAndColToXY(row:number, col:number): {x:number,y:number}{
    const hexWidth = 2* this.hexSize; // 六边形的宽度
    const hexHeight = Math.sqrt(3) * this.hexSize; // 六边形的高度
    var x:number = row * hexWidth*3/2;
    var y:number = col * (hexHeight); // 行之间的垂直间距
    return {x:x,y:y};
  }

  generateHexMap(rows: number, cols: number): void {
    const hexWidth = 2* this.hexSize; // 六边形的宽度
    const hexHeight = Math.sqrt(3) * this.hexSize; // 六边形的高度
    const randomImage = 'assets/Car.png' ;
    const cityImage = 'assets/City.png'
    // 初始化城市和单位的部分应该写到外置文件中,这里只是简单的初始化
    // 第一个循环的row和col需要记录
    for (let row = 0; row < rows; row++) {
      for(let col = 0; col < cols; col++) {
        // if (row == 0 || col == 0 || row == rows - 1 || col == cols - 1) continue;
        var result = this.rowAndColToXY(row,col);
        var x = result.x;
        var y = result.y;
        var unit = null;
        if(row==1 && col==1 || row ==3 && col ==6 || row == 4 && col == 1 || row == 5 && col == 1){
          // if(row==1 && col==1){
          //   unit = Unit.createNormalCavalry();
          // }
          // else if(row ==3 && col ==6){
          //   unit = Unit.createNormalCavalry();
          // }
          // else if(row == 4 && col == 1){
          //   unit = Unit.createNormalInfantry(Unit.aiCamp);
          // }
          // // 再来一个unit
          // else if(row == 5 && col == 1){
          //   unit = Unit.createNormalInfantry(Unit.aiCamp);
          // }
          
          const hexagon = new Hexagon(x, y, this.hexSize,this.hexagonColor,unit);
          this.hexagons.push(hexagon);
          continue;
        }
        // 初始化城市
        // let city = null;
        // if (row === 2 && col === 3) {
        //   city = new City('Capital','capital',3,100,100,cityImage,this.playerCamp);
        // } else if (row === 6 && col === 8) {
        //   city = new City('Village','village',1, 50,100,cityImage,this.aiCamp);
        // }
        // city暂时不添加
        const hexagon = new Hexagon(x, y, this.hexSize,this.hexagonColor,unit,null);
        this.hexagons.push(hexagon);
      }
    }
    // 这是第二个循环的row和col
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // if(row==0 || col==0 || row==rows-1 || col==cols-1) continue;
        var x = row * hexWidth * 3 / 2 + this.hexSize*3/2;
        var y = col * (hexHeight) +(hexHeight)/2; // 行之间的垂直间距
        const hexagon = new Hexagon(x, y, this.hexSize,this.hexagonColor);
        this.hexagons.push(hexagon);
      }
    }
    this.initAICamp(rows,cols);
    this.initPlayerCamp(rows,cols);
  }

  saveUnitsToFile() {
    // 提取兵种信息
    const unitsData = this.hexagons
      .filter(hex => hex.unit) // 筛选有兵种的地块
      .map(hex => ({
        x: hex.x,
        y: hex.y,
        unit: {
          image: hex.unit?.image,
          camp: hex.unit?.camp,
          health: hex.unit?.health,
          maxHealth: hex.unit?.maxHealth,
          movementSpeed: hex.unit?.movementSpeed,
          attackUpperLimit: hex.unit?.attackUpperLimit,
          attackLowerLimit: hex.unit?.attackLowerLimit,
          counterAttackChance: hex.unit?.counterAttackChance,
          attackRange: hex.unit?.attackRange,
          hasMoved: hex.unit?.hasMoved,
          hasAttacked: hex.unit?.hasAttacked
        }
      }));

    // 将数据保存为 JSON 字符串
    const jsonString = JSON.stringify(unitsData, null, 2);

    // 创建一个文件并下载
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'units.json';
    link.click();
  }

  loadUnitsFromFile(event: any) {
    // 先清空所有兵种
    for (let hex of this.hexagons) {
      hex.unit = null;
    }
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;

        try {
          // 解析 JSON 数据
          const unitsData = JSON.parse(content);

          // 将兵种信息加载到地图中
          unitsData.forEach((unitData: any) => {
            const { x, y, unit } = unitData;

            // 找到对应地块并设置兵种
            const hex = this.hexagons.find(h => h.x === x && h.y === y);
            if (hex) {
              hex.unit = new Unit(
                unit.movementSpeed,
                unit.image,
                unit.health,
                unit.maxHealth,
                unit.camp,
                unit.attackUpperLimit,
                unit.attackLowerLimit,
                unit.counterAttackChance,
                unit.attackRange,
                unit.hasMoved,
                unit.hasAttacked
              );
            }
          });

          alert('兵种数据已加载成功！');
        } catch (error) {
          console.error('解析文件时出错:', error);
          alert('文件格式错误或内容无效！');
        }
      };

      reader.readAsText(file);
    }
  }



  getHexagonPoints(hex: Hexagon): string {
    const vertices = hex.getVertices();
    return vertices.map(v => `${v[0]},${v[1]}`).join(' ');
  }

  inputValue: string = ''; // 输入框的值

  // 作弊方法: 玩家输入w直接进入下一关
  // 处理键盘事件的函数
  onKeyDown(event: KeyboardEvent) {
    // 检查是否按下了Ctrl + W
    if (event.key === 'w') {
      // 调用框架的某个函数，这里简单打印一条消息作为示例
      // 判断是不是完全获胜
      if(!this.judgePlayerAllWin()){
        // 进入商店
        this.enterShop();
        // 进入下一关
        this.enterNextLevel();
        // 阻止默认行为
        event.preventDefault();
      }
    }
  }

  enterShop(){
    // 待完成,将页面主要内容更改为购买将领或单位的页面

  }

  enterNextLevel(){
    // 结束游戏
    alert('本轮游戏结束，玩家胜利。进入下一轮游戏');

    // 挺进一小关
    this.littleRound++;
    // 小关: 只有1-3
    if(this.littleRound > 3){
      this.littleRound = 1;
      this.bigRound++;
    }
    // 部署地图上的敌方兵种
    for (let hexagon of this.hexagons) {
      hexagon.unit = null;
    }

    // 部署敌方兵种
    this.initAICamp(10,10);
    

    // 部署我方兵种(目前为默认部署,2骑兵)
    this.initPlayerCamp(10,10);

    // 重新开始游戏
    // window.location.reload();
  }

  judgePlayerAllWin():Boolean{
    // 如果8-3到了,则判定玩家获胜!
    if (this.bigRound === 8 && this.littleRound === 3) {
      alert('恭喜玩家获胜!关卡已结束,退出以开始新的剧本');
      alert("新的剧本制作中......");
      window.location.reload();
      return true;
    }
    return false;
  }

  // 玩家回合结束
  endPlayerTurn(): void {
    // 如果有选中的单位,让其取消选中
    if(this.selectedHex !== null){
      this.selectedHex.color = this.hexagonColor;
      this.selectedHex = null;
    }
    // 检查是否有未行动的玩家单位
    const unactedUnits = this.hexagons.some(
      (hex) => hex.unit && hex.unit.camp === this.playerCamp && (!hex.unit.hasAttacked && !hex.unit.hasMoved)
    );

    if (unactedUnits) {
      // 弹出对话框询问是否结束回合
      const confirmation = window.confirm('还有未行动的单位，是否确定结束回合？');
      if (!confirmation) {
        console.log('玩家取消了结束回合操作。');
        return;
      }
    }

    console.log('玩家回合结束，开始 AI 回合。');

    // 重置所有玩家单位的行动状态
    for (let hexagon of this.hexagons) {
      if (hexagon.unit && hexagon.unit.camp === Unit.playerCamp) {
        hexagon.unit.resetAction();
      }
    }

    // 切换到 AI 回合
    this.currentTurn = 'ai';

    // 开始 AI 回合
    this.startAiTurn();

    this.turnCount++;
    // 如果超过指定回合数(目前为5),则结束游戏并宣布玩家失败

    // 如果所有的AI单位都被消灭,则玩家获胜
    let isPlayerWin = true;
    for (let hexagon of this.hexagons) {
      if(hexagon.unit && hexagon.unit.camp === Unit.aiCamp){
        isPlayerWin = false;
        break;
      }
    }

    if(isPlayerWin){
      if(!this.judgePlayerAllWin())
        this.enterNextLevel();
    }

    if(this.turnCount > 5){
      // 结束游戏
      alert('游戏结束，玩家失败。');
      // 重新开始游戏
      window.location.reload();
    }

    // AI 回合结束后，开始新的玩家回合
    this.startPlayerTurn();


  }

  // AI 回合
  startAiTurn(): void {
    console.log('AI 回合开始。');

    // AI 行动逻辑
    for (let hexagon of this.hexagons) {
      if (hexagon.unit && hexagon.unit.camp === Unit.aiCamp && !hexagon.unit.hasMoved) {
        this.aiMove(hexagon);
      }
    }

    console.log('AI 回合结束，切换到玩家回合。');

    // 重置所有 AI 单位的行动状态
    for (let hexagon of this.hexagons) {
      if (hexagon.unit && hexagon.unit.camp === Unit.aiCamp) {
        hexagon.unit.resetAction();
      }
    }

    // 切换回玩家回合
    this.currentTurn = 'player';
  }

  aiMove(hex: Hexagon): void {
    // 如果当前地块没有单位或单位不属于 AI 阵营，跳过
    if (!hex.unit || hex.unit.camp !== Unit.aiCamp) {
      return;
    }

    console.log(`AI 单位 (${hex.x}, ${hex.y}) 正在寻找攻击目标。`);

    // 遍历所有玩家单位
    let attacked = false;
    for (let targetHex of this.hexagons) {
      if (
        targetHex.unit &&
        targetHex.unit.camp === Unit.playerCamp && // 玩家单位
        this.isReachable(hex, targetHex, hex.unit.movementSpeed) // 判断是否在攻击范围内
      ) {
        console.log(
          `AI 单位 (${hex.x}, ${hex.y}) 攻击玩家单位 (${targetHex.x}, ${targetHex.y})`
        );

        // AI 单位攻击玩家单位
        const damage = hex.unit.attack(); // 计算攻击伤害
        targetHex.unit.takeDamage(damage); // 玩家单位承受伤害

        console.log(
          `玩家单位 (${targetHex.x}, ${targetHex.y}) 受到 ${damage} 点伤害，剩余血量：${targetHex.unit.health}`
        );

        // 如果玩家单位血量小于等于 0，则移除该单位
        if (targetHex.unit.health <= 0) {
          console.log(`玩家单位 (${targetHex.x}, ${targetHex.y}) 被击败并移除。`);
          targetHex.unit = null;
        }

        attacked = true; // 标记该 AI 单位已经攻击
        break; // 每个 AI 单位只能攻击一次，跳出循环
      }
    }

    // AI单位默认不动,活靶子
    // if (!attacked) {
    //   console.log(`AI 单位 (${hex.x}, ${hex.y}) 没有找到可攻击的玩家单位。`);
    //   // 如果没有找到可以攻击的玩家单位，则随机移动
    //   this.aiMoveRandom(hex);
    // }
  }

  // 代码有问题
  aiMoveRandom(hex: Hexagon): void {
    // 获取所有可移动到的地块
    const moveAbleSpots = this.getAllMoveAbleSpots(hex);

    // 如果可移动到的地块中有超出地图范围的地块，移除,这里有问题
    for (let i = moveAbleSpots.length - 1; i >= 0; i--) {
      const spot = moveAbleSpots[i];
      console.log(spot.x,spot.y);
      if (spot.x < 0 || spot.x >= 2*this.mapWidth || spot.y < 0 || spot.y >= 2*this.mapHeight) {
        moveAbleSpots.splice(i, 1);
      }
    }

    // 展示所有可移动到的地块
    for (let spot of moveAbleSpots) {
      console.log(`AI 单位 (${hex.x}, ${hex.y}) 可移动到 (${spot.x}, ${spot.y})`);
    }

    // 如果没有可移动到的地块，跳过
    if (moveAbleSpots.length === 0) {
      console.log(`AI 单位 (${hex.x}, ${hex.y}) 没有可移动的地块。`);
      return;
    }

    // 随机选择一个可移动到的地块
    const randomIndex = Math.floor(Math.random() * moveAbleSpots.length);
    const targetHex = moveAbleSpots[randomIndex];

    console.log(
      `AI 单位 (${hex.x}, ${hex.y}) 移动到 (${targetHex.x}, ${targetHex.y})`
    );

    // 如果新的坐标与老的坐标相同，跳过
    if (hex === targetHex) {
      console.log('AI 单位没有移动。');
      return;
    }

    // 如果新的坐标上有单位，跳过
    if (targetHex.unit) {
      console.log('AI 单位无法移动到已有单位的地块。');
      return
    }

    // 移动 AI 单位
    targetHex.unit = hex.unit;
    hex.unit = null;
  }

  startPlayerTurn(): void {
    // let playerIncome = 0;

    // // 遍历所有地块，计算当前玩家拥有的城市数量
    // for (let hex of this.hexagons) {
    //   if (hex.city && hex.city.camp === this.playerCamp) {
    //     playerIncome += hex.city.levelToIncome[hex.city.level];
    //   }
    // }


    // 每个城市为玩家产钱（例如每座城市产 10 金币）
    // this.playerMoney += playerIncome;

    // 每个将军发出技能
    var dict = new Map<string,any>();
    
    dict.set("units", this.getPlayerUnits());
    for(let general of this.generals){
      general.useSkill(dict);
    }
    this.highlightAvailableUnits();
  }


  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateMapSize(); // 窗口大小变化时更新地图大小
  }

  // 地图: 固定大小
  updateMapSize(): void {
    this.mapWidth = window.innerWidth * this.mapWidthMagFac; // 根据窗口宽度动态调整
    this.mapHeight = window.innerHeight * this.mapHeightMagFac; // 根据窗口高度动态调整
  }

  isMusicPlaying: boolean = false; // 标记音乐播放状态

  toggleMusic(): void {
    const audio = document.getElementById('background-music') as HTMLAudioElement;
    if (this.isMusicPlaying) {
      audio.pause(); // 暂停音乐
    } else {
      audio.muted = false; // 取消静音
      audio.play().catch(error => console.log('Error playing music:', error));
    }
    this.isMusicPlaying = !this.isMusicPlaying;
  }

}
