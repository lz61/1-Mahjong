export class fb_Message {
    sender: string = '';
    messageType: string = '';
    content: string = ''; // 消息内容
    // operation: 玩家操作,分为: 抽牌,出牌,胡牌
    // drawCard()
    //playCard(CardName)
    //winCard()
    operation: string = '';
    cardName: string = ''; // 只有出牌的时候需要cardName
    receiver: string = ''; // 指示该消息的接收者

    // 设置多种MessageType
    // MessageType: drawCard, playCard, winCard
    // MessageType: changeUserName
    // 新建Const
    drawCardMessageType: string = 'drawCard';

    playCardMessageType: string = 'playCard';

    winCardMessageType: string = 'winCard';

    changeUserNameMessageType: string = 'changeUserName';

    initializeGameType: string = 'initializeGame';

    player1Cards: string[] = [];
    player2Cards: string[] = [];
    
}
