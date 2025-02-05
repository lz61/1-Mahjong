import { Component, OnInit } from '@angular/core';
import { ChatService, GameState } from '../chat/chat.service';
import { fb_Message } from '../models/fb_message';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-player-battle',
  templateUrl: './player-battle.component.html',
  styleUrls: ['./player-battle.component.css']
})
export class PlayerBattleComponent implements OnInit {
  // 最好把逻辑判断都放在后端,前端只当函数
  playerCards: string[] = [];
  opponentCards: string[] = [];
  playerHealth: number = 2;
  opponentHealth: number = 2;
  currentPlayer: string = 'player1';
  winner: string = '';
  playerName : string = '';
  opponentRiverCards: string[] = []; // 对手牌河的牌
  playerRiverCards: string[] = []; // 我方牌河的牌
  // 起始就胡牌的手牌
  // playerTestWinCards: string[] = ['bamboo_1', 'bamboo_1', 'bamboo_1', 'bamboo_2', 'bamboo_2', 'bamboo_2', 'bamboo_3', 'bamboo_3', 'bamboo_3', 'bamboo_4', 'bamboo_4', 'bamboo_4', 'bamboo_5', 'bamboo_5'];

  ngOnInit() {
    this.initializeGame();
    // 订阅 ChatService 的游戏状态
    this.chatService.gameState$.subscribe((gameState: GameState | null) => {
      if (gameState) {
        this.updateGameState(gameState);
        console.log("Player cards are", this.playerCards);
      }
    });
  }

  private updateGameState(gameState: GameState): void {
    console.log('更新组件状态:', gameState);
    this.playerCards = gameState.playerCards;
    this.opponentCards = gameState.opponentCards;
    this.playerHealth = gameState.playerHealth;
    this.opponentHealth = gameState.opponentHealth;
    this.currentPlayer = gameState.currentPlayer;
    this.winner = gameState.winner;
    this.opponentRiverCards = gameState.opponentRiverCards;
    this.playerRiverCards = gameState.playerRiverCards;
    // 仅在 playerName 为空时更新playerName
    if (!this.playerName && gameState.playerName) {
      this.playerName = gameState.playerName;
      console.log('playerName 已更新:', this.playerName);
    } else {
      console.log('playerName 已存在，忽略更新');
    }
    // 已知playerName,更新playerCards与opponentCards
    if(this.playerName){
      if(this.playerName === 'player1'){
        this.playerCards = gameState.player1Cards;
        this.opponentCards = gameState.player2Cards;
        this.playerHealth = gameState.player1Health;
        this.opponentHealth = gameState.player2Health;
        this.playerRiverCards = gameState.player1RiverCards;
        this.opponentRiverCards = gameState.player2RiverCards;
      }else if(this.playerName === 'player2'){
        this.playerCards = gameState.player2Cards;
        this.opponentCards = gameState.player1Cards;
        this.playerHealth = gameState.player2Health;
        this.opponentHealth = gameState.player1Health;
        this.playerRiverCards = gameState.player2RiverCards;
        this.opponentRiverCards = gameState.player1RiverCards;
      }
    }
  }

  // 默认给玩家起始胡牌
  constructor(public chatService: ChatService, private cdr: ChangeDetectorRef) {
    this.fb_message = new fb_Message();
  }


  initializeGame() {
    // 随机抽取 13 张牌给玩家和 AI
    this.initializeCardImage();
    this.handOutPlayerCards();
    this.playerCards.sort();
    this.opponentCards.sort();
  }
  // 牌面的映射关系：根据牌的名字生成对应的图片路径
  cardImages: { [key: string]: string } = {}

  initializeCardImage() {
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
      deck.push('red dragon');//红中
      deck.push('green dragon');// 绿发
      deck.push('white dragon');     // 白板
      // 根据deck中的每一张牌生成对应的图片路径
      deck.forEach(card => {
        this.cardImages[card] = `assets/cards/${card}.png`;
      });
      // console.log(deck);
      // console.log(this.cardImages);
    }
    return deck.sort(() => Math.random() - 0.5); // 随机打乱
  }

  // 通过牌名生成对应的图片路径
  getCardImage(card: string) {
    return this.cardImages[card];
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
    this.fb_message.sender = this.playerName;
    this.fb_message.messageType = this.fb_message.playCardMessageType;
    this.fb_message.cardName = playedCard;
    // 向后端发送请求
    this.sendMessage();

  }

  // 网页端测试,不要动
  handOutPlayerCards() {
    // 随机出牌
    // this.playerCards = this.deck.splice(0, 13).sort();
    // 系统指定摸牌
    // this.playerCards = this.playerTestWinCards;
  }

  restartGame() {
    // 重新生成牌堆
    // this.deck = this.generateDeck();

    // 清空玩家和 AI 的手牌
    this.playerCards = [];
    this.opponentCards = [];

    // 清空牌河
    this.playerRiverCards = [];
    this.opponentRiverCards = [];

    // 发牌：随机抽取 13 张牌给玩家和 AI
    this.handOutPlayerCards();
    // this.aiCards = this.deck.splice(0, 13).sort();

    // 不需要重置玩家和 AI 的血量

    // 重置游戏状态
    this.currentPlayer = 'player';
    this.winner = '';

    console.log('新的一局开始了！');
  }

  winCard() {
    const hand = [...this.playerCards]; // 复制玩家的手牌

    if (this.checkWin(hand)) {
      console.log("玩家胡牌！");
      // 向后端发送胡牌请求
      this.fb_message.messageType = this.fb_message.winCardMessageType;
      this.fb_message.sender = this.playerName;
      this.sendMessage();
      // this.checkGameOver(); 
      // this.restartGame();
    } else {
      alert("请不要在不能胡牌时点击胡牌按钮")
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
    console.log('当前玩家:', this.currentPlayer);
    console.log('当前玩家名:', this.playerName);
    if(this.currentPlayer != this.playerName){
      alert('当前不是你的回合');
      return;
    }
    // 玩家抽牌
    // 向后端发送请求
    // 准备好fb_message
    // 只有当该用户是正要出牌用户时才能发送message
    this.fb_message.messageType = this.fb_message.drawCardMessageType;
    this.fb_message.sender = this.playerName;

    this.sendMessage();
  }


  // 检查是否游戏结束
  checkGameOver() {
    if (this.playerHealth === 0) {
      this.winner = 'AI';
    } else if (this.opponentHealth === 0) {
      this.winner = 'Player';
      alert("恭喜玩家获胜!")
      alert("即将刷新页面重启游戏...")
      // 刷新页面
      window.location.reload();
    }
  }

  // 网络交互部分
  // sender: string= crypto.randomUUID();  // 用户名
  message: string = ""; // 输入框的消息
  fb_message: fb_Message;
  // 发送消息
  sendMessage() {
    this.chatService.sendMessage(this.fb_message);
    this.message = ''; // 清空输入框
  }
}
