class GameStateModel {
  constructor(botUserId) {
    this.botUserId = botUserId;
    this.channel = null;
    this.clear();
  }

  clear() {
    this.requests = {};
    this.gameTimeoutId = -1;
    this.constructingTeams = false;
    this.welcomeMessage = null;
    this.autoSignedPlayer = null;
  }
}

module.exports = GameStateModel;
