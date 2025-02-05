import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { fb_Message } from '../models/fb_message';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  playerCards: string[];
  player1Cards: string[];
  player2Cards: string[];
  player1Health: number;
  player2Health: number;
  opponentCards: string[];
  playerHealth: number;
  opponentHealth: number;
  currentPlayer: string;
  winner: string;
  playerName: string;
  opponentRiverCards: string[];
  playerRiverCards: string[];
  player1RiverCards: string[];
  player2RiverCards: string[];
}


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private gameStateSubject = new BehaviorSubject<GameState | null>(null);
  gameState$ = this.gameStateSubject.asObservable();

  private client!: Client; // STOMP 客户端实例
  public messages: string[] = []; // 用于存储聊天消息
  public fb_message: fb_Message;

  // 客户端名称
  public sender: string = '';

  constructor() {
    this.connect();
    this.fb_message = new fb_Message();
  }

  // 建立 WebSocket 连接
  connect() {
    this.client = new Client({
      // localhost和192.168.*.*的抉择要考虑
      // 目前本机ip地址: 172.20.10.2
      brokerURL: 'ws://localhost:8080/chat/websocket', // WebSocket 服务器地址
      // brokerURL: 'ws://172.20.10.2:8080/chat/websocket',
      connectHeaders: {},
      debug: (str) => console.log(str), // 调试日志
      reconnectDelay: 5000, // 断开后重新连接的延迟
      heartbeatIncoming: 4000, // 心跳检测（接收）
      heartbeatOutgoing: 4000, // 心跳检测（发送）
    });

    // 连接成功的回调
    this.client.onConnect = () => {
      console.log('Connected to WebSocket server');
      this.fb_message.content = 'Hello, WebSocket!';
      this.fb_message.sender = this.sender;
      // 默认发送一条初始化消息
      this.client.publish({
        destination: '/app/initialize', // 后端处理的路径
        body: JSON.stringify(this.fb_message), // 消息体
      });
      console.log('已发送初始化消息');
      this.receiveMessage();
    };

    // 错误处理
    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    // 激活客户端
    this.client.activate();
  }


  // 建立接收消息逻辑
  receiveMessage() {
    this.client.subscribe('/topic/messages', (message: Message) => {
      const gameState: GameState = JSON.parse(message.body);
      console.log('接收到后端游戏状态:', gameState);

      // 广播游戏状态数据
      this.gameStateSubject.next(gameState);
      console.log("接收到消息:", message.body);
    });
  }

  // 发送消息
  sendMessage(message: fb_Message) {
    console.log("发出消息:", message);
    this.client.publish({ destination: '/app/send', body: JSON.stringify(message) });
  }


}
