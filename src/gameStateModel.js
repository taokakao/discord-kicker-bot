class GameStateModel {
  constructor(botUserId) {
    this.botUserId = botUserId;
    this.channel = null;
    this.clear();
  }

  clear() {
    this.requests = {};
    this.constructingTeams = false;
    this.welcomeMessage = null;
  }
}

module.exports = GameStateModel;
