class MessageRouter {
  constructor(channelName, botCore) {
    this.botCore = botCore;
    this.channelName = channelName;
  }

  route(message) {
    const channel = message.channel;
    const text = message.content;

    if (message.isMentioned(this.botCore.stateModel.botUserId)) {
      this.botCore.help(message);
    }

    if (channel.type !== 'text' || channel.name !== this.channelName) {
      return;
    }

    if (text === 'go' || text === 'пщ') {
      this.botCore.go(message);
    }

    if (text === 'cancel') {
      this.botCore.cancel(message);
    }
  }
}

module.exports = MessageRouter;
