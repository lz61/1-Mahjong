package com.example.demo.entity;

import java.util.List;

public class ChatMessage {
    private String sender; // 发送者
    private String messageType; // 消息类型
    private String content; // 消息内容
    private String operation; // 玩家操作: 抽牌, 出牌, 胡牌
    private String cardName; // 牌名 (仅在抽牌或出牌时需要)
    private String receiver; // 接收者
    private String currentPlayer; // 当前出牌方
    private Integer player1Health;

    private Integer player2Health;

    private String playerName; // 玩家名
    private List<String> player1Cards; // 玩家1手牌

    private List<String> player2Cards; // 玩家2手牌
    private List<String> player1RiverCards; // 玩家1河牌

    private List<String> player2RiverCards; // 玩家2河牌

    public List<String> getPlayer1RiverCards() {
        return player1RiverCards;
    }

    public void setPlayer1RiverCards(List<String> player1RiverCards) {
        this.player1RiverCards = player1RiverCards;
    }

    public List<String> getPlayer2RiverCards() {
        return player2RiverCards;
    }

    public void setPlayer2RiverCards(List<String> player2RiverCards) {
        this.player2RiverCards = player2RiverCards;
    }



    public Integer getPlayer1Health() {
        return player1Health;
    }

    public void setPlayer1Health(Integer player1Health) {
        this.player1Health = player1Health;
    }

    public Integer getPlayer2Health() {
        return player2Health;
    }

    public void setPlayer2Health(Integer player2Health) {
        this.player2Health = player2Health;
    }



    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }



    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }



    public ChatMessage() {}

    public ChatMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getCardName() {
        return cardName;
    }

    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    public String getCurrentPlayer() {
        return currentPlayer;
    }

    public void setCurrentPlayer(String currentPlayer) {
        this.currentPlayer = currentPlayer;
    }

    public List<String> getPlayer1Cards() {
        return player1Cards;
    }

    public void setPlayer1Cards(List<String> player1Cards) {
        this.player1Cards = player1Cards;
    }

    public List<String> getPlayer2Cards() {
        return player2Cards;
    }

    public void setPlayer2Cards(List<String> player2Cards) {
        this.player2Cards = player2Cards;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "sender='" + sender + '\'' +
                ", messageType='" + messageType + '\'' +
                ", content='" + content + '\'' +
                ", operation='" + operation + '\'' +
                ", cardName='" + cardName + '\'' +
                ", receiver='" + receiver + '\'' +
                ", currentPlayer='" + currentPlayer + '\'' +
                ", player1Cards=" + player1Cards +
                ", player2Cards=" + player2Cards +
                '}';
    }

}
