import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { fb_Message } from '../models/fb_message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  fb_message: fb_Message;
  message: string = ''; // 输入框的消息
  sender: string = '';

  constructor(public chatService: ChatService) { 
    this.fb_message = new fb_Message();
  }

  // 发送消息
  sendMessage() {
    this.fb_message.sender = this.sender;
    this.fb_message.content = this.message;
    if (this.fb_message.sender && this.fb_message.content) {
      
      this.chatService.sendMessage(this.fb_message);
      this.message = ''; // 清空输入框
    }
  }
}


