class BotCore {
  constructor(logger) {
    this.constructingTeam = false;
    this.logger = logger;
  }

  go() {
    this.logger.log('go request');

    if (this.constructingTeam) {
      this.logger.log('go request cancelled: team is under construction at the moment');
      return;
    }

    this.constructingTeam = true;
    this.logger.log('start constructing team');
  }
}

module.exports = BotCore;
