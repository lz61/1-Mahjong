package com.example.demo.controller;

import com.example.demo.MessageType;
import com.example.demo.entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.example.demo.WebSocketEventListener.playerCount;

@Controller
public class ChatController {
    private List<String> deck = new ArrayList<>();
    private List<String> player1Cards = new ArrayList<>();

    private List<String> player2Cards = new ArrayList<>();

    private List<String> player1RiverCards = new ArrayList<>();

    private List<String> player2RiverCards = new ArrayList<>();

    private Integer player1Health = 2;
    private Integer player2Health = 2;

    public ChatController() {
        initializeDeck();
    }

    // 尝试作弊牌组
    private void initializePlayer1Cards(List<String> deck){
        player1Cards.clear();
        // 开局就能胡的14张牌
        player1Cards.add("bamboo_1");
        player1Cards.add("bamboo_1");
        player1Cards.add("bamboo_1");
        player1Cards.add("bamboo_2");
        player1Cards.add("bamboo_2");
        player1Cards.add("bamboo_2");
        player1Cards.add("bamboo_3");
        player1Cards.add("bamboo_3");
        player1Cards.add("bamboo_3");
        player1Cards.add("bamboo_4");
        player1Cards.add("bamboo_4");
        player1Cards.add("bamboo_4");
        player1Cards.add("bamboo_5");
        player1Cards.add("bamboo_5");
    }

    // 初始化牌堆
    private void initializeDeck() {
        player1Cards.clear();
        player2Cards.clear();
        player1RiverCards.clear();
        player2RiverCards.clear();
        // 给牌库添加字牌
        for(int j=0; j<4; j++) {
            deck.add("east");
            deck.add("south");
            deck.add("west");
            deck.add("north");
            deck.add("red dragon");
            deck.add("green dragon");
            deck.add("white dragon");
        }
        String[] suits = {"bamboo", "character", "dot"};
        for (String suit : suits) {
            for (int i = 1; i <= 9; i++) {
                for (int j = 0; j < 4; j++) {
                    deck.add(suit + "_" + i);
                }
            }
        }
        Collections.shuffle(deck);
        // random cards
        for (int i = 0; i < 13; i++) {
            player1Cards.add(deck.remove(deck.size() - 1));
        }
//        initializePlayer1Cards(deck);
        player1Cards.sort(String::compareTo);
        for (int i=0; i<13; i++){
            player2Cards.add(deck.remove(deck.size() - 1));
        }
        player2Cards.sort(String::compareTo);

    }
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/initialize") // 匹配前端 `/app/initialize`
    @SendTo("/topic/messages") // 广播到 `/topic/messages`
    public ChatMessage handleInitialize(ChatMessage message){
        System.out.println("initialize");
        System.out.println("Message content: " + message.getContent());

        // Server: 发送重命名消息
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent("player"+playerCount);
        chatMessage.setMessageType(MessageType.changeUserNameMessageType);
        chatMessage.setReceiver(message.getSender());
        chatMessage.setPlayerName("player"+playerCount);
        // 一起把牌组发过去
        chatMessage.setPlayer1Cards(player1Cards);
        chatMessage.setPlayer2Cards(player2Cards);
        System.out.println("player1Cards: " + player1Cards);
        System.out.println("player2Cards: " + player2Cards);
        // 设置当前玩家
        chatMessage.setCurrentPlayer("player1");
        player1Health = 2;
        player2Health = 2;
        chatMessage.setPlayer1Health(player1Health);
        chatMessage.setPlayer2Health(player2Health);
        // 发送给所有人,所有人基于自己的uuid进行判断消息是不是发送给自己的
        return chatMessage;
    }

    // 处理客户端发送的消息，并广播给所有订阅者
    @MessageMapping("/send") // 匹配前端 `/app/send`
    @SendTo("/topic/messages") // 广播到 `/topic/messages`
    public ChatMessage handleMessage(ChatMessage message) {
        System.out.println("Received message from: " + message.getSender());
        System.out.println(message.toString());
        // 群发消息
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender("server");


        // 考虑消息类型: MessageType = drawCard
        switch (message.getMessageType()){
            case (MessageType.drawCard): {
                // 从牌堆中抽一张牌
                String card = deck.remove(deck.size() - 1);
                System.out.println("消息的发送方是" + message.getSender());
                // 将抽到的牌加入玩家手牌
                if (message.getSender().equals("player1"))
                    player1Cards.add(card);
                else if (message.getSender().equals("player2"))
                    player2Cards.add(card);
                else {
                    System.out.println("玩家身份错误");
                    System.out.println("出现了奇怪的bug");
                }
                chatMessage.setCurrentPlayer(message.getSender());
                chatMessage.setPlayer1Health(2);
                chatMessage.setPlayer2Health(2);
            }
            break;
            case(MessageType.playCard):{
                // 从玩家手牌中移除出牌
                if (message.getSender().equals("player1")){
                    player1Cards.remove(message.getCardName());
                    player1Cards.sort(String::compareTo);
                    player1RiverCards.add(message.getCardName());
                }
                else if(message.getSender().equals("player2")) {
                    player2Cards.remove(message.getCardName());
                    player2Cards.sort(String::compareTo);
                    player2RiverCards.add(message.getCardName());
                }
                else{
                    System.out.println("玩家身份错误");
                    System.out.println("出现了奇怪的bug");
                }
                // 更新玩家回合
                if (message.getSender().equals("player1"))
                    chatMessage.setCurrentPlayer("player2");
                else if(message.getSender().equals("player2"))
                    chatMessage.setCurrentPlayer("player1");
                chatMessage.setPlayer1Health(2);
                chatMessage.setPlayer2Health(2);
            }
            break;
            case(MessageType.winCard):
            {
                if(message.getSender().equals("player1")){
                    player2Health--;
                }
                else if(message.getSender().equals("player2")){
                    player1Health--;
                }
                else{
                    System.out.println("玩家身份错误");
                    System.out.println("出现了奇怪的bug");
                }
                // 重置牌局
                initializeDeck();
                chatMessage.setCurrentPlayer("player1");
                chatMessage.setPlayer1Health(player1Health);
                chatMessage.setPlayer2Health(player2Health);
                // 如果有玩家生命值为0,重置游戏
                if(player1Health == 0 || player2Health == 0){
                    player1Health = 2;
                    player2Health = 2;
                    chatMessage.setPlayer1Health(player1Health);
                    chatMessage.setPlayer2Health(player2Health);
                }

            }
            break;
        }
        chatMessage.setPlayer1Cards(player1Cards);
        chatMessage.setPlayer2Cards(player2Cards);
        chatMessage.setPlayer1RiverCards(player1RiverCards);
        chatMessage.setPlayer2RiverCards(player2RiverCards);

        return chatMessage;
    }
}

