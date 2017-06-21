class MessageRouter {
  constructor(botCore) {
    this.botCore = botCore;
  }

  route(message) {
    const text = message.content;

    if (text === 'go' || text === 'пщ') {
      this.botCore.go(message.channel);
    }

    if (text === 'cancel') {
      this.botCore.cancel(message);
    }
  }
}

module.exports = MessageRouter;
