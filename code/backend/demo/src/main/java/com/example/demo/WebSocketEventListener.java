package com.example.demo;

import com.example.demo.entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
    public static Integer playerCount = 0;

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        // 从事件中获取断开连接的会话信息
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // 递减玩家计数
        synchronized (WebSocketEventListener.class) {
            playerCount = Math.max(playerCount - 1, 0); // 确保计数不为负
        }
        System.out.println("用户断开连接，Session ID: " + sessionId);
        System.out.println("当前在线玩家数: " + playerCount);
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    // 用户连接时增加玩家计数
    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        synchronized (WebSocketEventListener.class) {
            playerCount++;
        }
        System.out.println("用户已连接，当前在线玩家数: " + playerCount);

        // 获取连接的会话 ID
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // 构建欢迎消息
        String welcomeMessage = "欢迎用户 " + sessionId + " 加入！";
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(welcomeMessage);       // 向特定客户端发送消息
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/welcome", welcomeMessage);

        System.out.println("已向会话 " + sessionId + " 发送欢迎消息");
    }

}
