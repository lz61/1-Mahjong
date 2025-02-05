import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './ai-battle.component.html',
  styleUrls: ['./ai-battle.component.css']
})
export class AiBattleComponent implements OnInit {
  playerCards: string[] = [];
  aiCards: string[] = [];
  deck: string[] = [];
  playerHealth: number = 2;
  aiHealth: number = 2;
  currentPlayer: 'player' | 'ai' = 'player';
  winner: string = '';
  aiRiverCards: string[] = []; // 牌河的牌
  playerRiverCards: string[] = []; // 牌河的牌
  // 默认对手停滞时间
  opponentDelaySecond: number = 1;
  // 起始就胡牌的手牌
  playerTestWinCards: string[] = ['bamboo_1', 'bamboo_1', 'bamboo_1', 'bamboo_2', 'bamboo_2', 'bamboo_2', 'bamboo_3', 'bamboo_3', 'bamboo_3', 'bamboo_4', 'bamboo_4', 'bamboo_4', 'bamboo_5', 'bamboo_5'];
  

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    // 初始化牌堆
    this.deck = this.generateDeck();
    // 随机抽取 13 张牌给玩家和 AI
    this.handOutPlayerCards();
    this.aiCards = this.deck.splice(0, 13);
    // 对这 13 张牌进行排序
    this.playerCards.sort();
    this.aiCards.sort();
  }
  // 牌面的映射关系：根据牌的名字生成对应的图片路径
  cardImages: { [key: string]: string } = {}


  // 通过牌名生成对应的图片路径
  getCardImage(card: string) {
    return this.cardImages[card];
  }

  // 生成一副牌的数组
  // 所有牌: 1-9 万、1-9 条、1-9 筒各4张,东西南北中发白各4张，共 136 张
  generateDeck() {
    const suits = ['bamboo', 'character', 'dot']; // 三种花色
    const deck: string[] = [];
    for (let n = 1; n <= 4; n++) {
      for (let suit of suits) {
        for (let i = 1; i <= 9; i++) {
          deck.push(`${suit}_${i}`);
        }
      }
      // 东西南北中发白
      deck.push('east');
      deck.push('west');
      deck.push('south');
      deck.push('north');
      deck.push('red dragon'); //红中
      deck.push('green dragon'); // 绿发
      deck.push('white dragon');     // 白板
      // 根据deck中的每一张牌生成对应的图片路径
      deck.forEach(card => {
        // const cardName = card.replace(/\s+/g, '_'); // 将空格替换为下划线，符合命名规范
        this.cardImages[card] = `assets/cards/${card}.png`;
      });
      // console.log(deck);
      // console.log(this.cardImages);
    }
    return deck.sort(() => Math.random() - 0.5); // 随机打乱
  }

  // 玩家出牌
  playCard(index: number) {
    // 判断玩家是否有14张牌,如果没有14张牌不让出牌
    if (this.playerCards.length !== 14) {
      alert('出牌前请抽牌');
      return
    }
    // 获取玩家双击的卡牌
    const playedCard = this.playerCards[index];

    // 从玩家手牌中移除该卡牌
    this.playerCards.splice(index, 1);

    // 将卡牌添加到牌河
    this.playerRiverCards.push(playedCard);

    // 排序玩家手牌
    this.playerCards.sort();

    console.log(`玩家打出了卡牌: ${playedCard}`);

    // 检查玩家是否获胜
    if (this.checkWin(this.playerCards)) {
      this.aiHealth--;
      this.checkGameOver();
    } else {
      // 玩家打牌后，切换到 AI 回合
      // this.currentPlayer = 'ai';
      this.aiTurn();
    }
  }

  handOutPlayerCards() {
    // 随机出牌
    this.playerCards = this.deck.splice(0, 13).sort();
    // 系统指定摸牌
    // this.playerCards = this.playerTestWinCards;
  }

  restartGame() {
    // 重新生成牌堆
    this.deck = this.generateDeck();

    // 清空玩家和 AI 的手牌
    this.playerCards = [];
    this.aiCards = [];

    // 清空牌河
    this.playerRiverCards = [];
    this.aiRiverCards = [];

    // 发牌：随机抽取 13 张牌给玩家和 AI
    this.handOutPlayerCards();
    this.aiCards = this.deck.splice(0, 13).sort();

    // 不需要重置玩家和 AI 的血量

    // 重置游戏状态
    this.currentPlayer = 'player';
    this.winner = '';

    console.log('新的一局开始了！');
  }

  winCard() {
    // 1. 检查玩家手牌
    const hand = [...this.playerCards]; // 复制玩家的手牌

    if (this.checkWin(hand)) {
      console.log("玩家胡牌！");
      this.winner = 'Player';
      this.aiHealth--;
      this.checkGameOver(); // 结束游戏逻辑
      this.restartGame();
    } else {
      console.log("玩家未能胡牌！");
    }
  }

  // 2. 胡牌判定函数
  checkWin(hand: string[]): boolean {
    if (hand.length !== 14) {
      return false; // 胡牌必须是14张牌
    }

    // 对手牌进行排序（方便判定顺子和刻子）
    hand.sort();

    // 遍历手牌，尝试将每一对牌作为将
    for (let i = 0; i < hand.length - 1; i++) {
      if (hand[i] === hand[i + 1]) {
        // 将当前对子作为将
        const remainingCards = hand.filter((_, index) => index !== i && index !== i + 1);

        // 检查剩余牌是否能组成 4 组刻子或顺子
        if (this.canFormMelds(remainingCards)) {
          return true;
        }
      }
    }

    return false; // 如果没有找到任何满足胡牌条件的组合，返回 false
  }

  // 3. 检查是否能组成 4 组刻子或顺子
  canFormMelds(cards: string[]): boolean {
    if (cards.length === 0) {
      return true; // 所有牌都被分组成功
    }

    // 如果有刻子（3张相同的牌）
    for (let i = 0; i < cards.length - 2; i++) {
      if (cards[i] === cards[i + 1] && cards[i] === cards[i + 2]) {
        const remainingCards = cards.filter((_, index) => index !== i && index !== i + 1 && index !== i + 2);
        if (this.canFormMelds(remainingCards)) {
          return true;
        }
      }
    }

    // 如果有顺子（同花色的连续3张）
    for (let i = 0; i < cards.length - 2; i++) {
      const suit = cards[i].split('_')[0]; // 花色
      const num = parseInt(cards[i].split('_')[1]); // 数字

      const card2 = `${suit}_${num + 1}`;
      const card3 = `${suit}_${num + 2}`;

      if (cards.includes(card2) && cards.includes(card3)) {
        const remainingCards = cards.filter((card) => card !== cards[i] && card !== card2 && card !== card3);
        if (this.canFormMelds(remainingCards)) {
          return true;
        }
      }
    }

    return false; // 无法组成刻子或顺子
  }


  // 抽牌
  drawCard() {
    // 判定当前玩家是否有14张牌
    if (this.playerCards.length > 13) {
      alert('抽牌前请打出一张牌');
      return;
    }
    const drawnCard = this.deck.pop();
    if (this.currentPlayer === 'player') {
      this.playerCards.push(drawnCard!);
      // this.playerCards.sort();
      // 玩家打牌后，轮到 AI
      // 现在是玩家出牌环节
    } else {
      alert('现在是 AI 回合，不能抽牌')
    }
  }

  // AI 回合，简单模拟
  aiTurn() {
    this.currentPlayer = 'ai';
    setTimeout(() => {
      const drawnCard = this.deck.pop();
      this.aiCards.push(drawnCard!);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * this.aiCards.length);
        const playedCard = this.aiCards[randomIndex];
        this.aiCards.splice(randomIndex, 1);
        // 将卡牌添加到牌河
        this.aiRiverCards.push(playedCard);
        this.aiCards.sort();
        console.log(`AI 打出了卡牌: ${playedCard}`);
        // 调整当前玩家
        this.currentPlayer = 'player';
      }
        , this.opponentDelaySecond * 2);
      // ai随机出一张牌
      if (this.checkWin(this.aiCards)) {
        this.playerHealth--;
        this.checkGameOver();
      } else {
        this.currentPlayer = 'player';
      }
    }, this.opponentDelaySecond);

  }

  // 检查是否游戏结束
  checkGameOver() {
    if (this.playerHealth === 0) {
      this.winner = 'AI';
    } else if (this.aiHealth === 0) {
      this.winner = 'Player';
      alert("恭喜玩家获胜!")
      alert("即将刷新页面...")
      // 刷新页面
      window.location.reload();
    }
  }
}

