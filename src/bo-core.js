const GameStateModel = require('./gameStateModel');
const Logger = require('./logger');
const Emoji = require('./emoji');
const Utils = require('./utils');

const teamSize = 1;

class BotCore {
  constructor(botUserId) {
    this.stateModel = new GameStateModel(botUserId);
    this.logger = new Logger('BotCore');
  }

  go(channel) {
    this.logger.log(`go request from channel '${channel.name}'`);

    if (this.stateModel.constructingTeams) {
      this.logger.log('go request cancelled: teams are under construction at the moment');
      channel.send('↑↑↑ Leave emoji on message above ↑↑↑');
      return;
    }

    this.logger.log('start constructing teams');

    this.stateModel.clear();
    this.stateModel.constructingTeams = true;
    this.stateModel.channel = channel;

    this.stateModel.channel.send('Emoji this message to join upcoming game').then((message) => {
      this.stateModel.welcomeMessage = message;
      message.react(Emoji.EGGPLANT);
      message.react(Emoji.HEART_EYES);
      message.react(Emoji.RUNNING_GHOST);
      message.react(Emoji.THUMBS_UP);
    });
  }

  cancel(message) {
    this.logger.log('cancel request');

    if (!this.stateModel.constructingTeams) {
      this.logger.log('cancel request cancelled: team is not under construction at the moment');
      this.stateModel.channel('Cannot cancel, no game announced yet');
      return;
    }

    message.react(Utils.getRandomElementFromArray([Emoji.POUTING_CAT, Emoji.JAPANESE_GOBLIN, Emoji.UNAMUSED]));
    this.logger.log('cancel constructing teams');
    this.stateModel.clear();
  }

  handleReactionAdd(reactionObject) {
    if (!this.stateModel.constructingTeams) {
      return;
    }
    if (!this.stateModel.welcomeMessage || this.stateModel.welcomeMessage.id !== reactionObject.message.id) {
      return;
    }
    this.logger.log('reaction added');
    this.updateTeam(reactionObject.users);
    this.checkTeamComplete();
  }

  handleReactionRemove(reactionObject) {
    if (!this.stateModel.constructingTeams) {
      return;
    }
    if (!this.stateModel.welcomeMessage || this.stateModel.welcomeMessage.id !== reactionObject.message.id) {
      return;
    }
    this.logger.log('reaction removed');
    this.updateTeam(reactionObject.users);
    this.checkTeamComplete();
  }

  updateTeam(userCollection) {
    const users = userCollection.array().filter((e, i, a) => a.indexOf(e) === i);
    this.logger.log(`requests to join: ${users.length}, ids: ${users.map(e => e.id).join(',')}`);
    for (const u of users) {
      // if (u.id !== this.stateModel.botUserId && !this.stateModel.team[u.id]) {
      if (!this.stateModel.requests[u.id]) {
        this.stateModel.requests[u.id] = u;
        this.logger.log(`accepted ${u.id}`);
      }
    }
  }

  checkTeamComplete() {
    const keys = Object.keys(this.stateModel.requests);
    if (keys.length >= teamSize * 2) {
      this.logger.log('teams are ready');
      this.printOutTeam(this.stateModel.requests);
      this.stateModel.clear();
    } else {
      this.logger.log(`teams are not ready yet, ${teamSize - keys.length} to go`);
    }
  }

  printOutTeam(team) {
    const keys = Object.keys(team).slice(0, teamSize * 2);
    const t1 = keys.slice(0, teamSize).map(e => `<@${e}>`);
    const t2 = keys.slice(teamSize).map(e => `<@${e}>`);
    this.logger.log(`team #1: ${t1}, team #2: ${t2}`);
    this.stateModel.channel.send(`Team 1: ${t1.join(' ')}`);
    this.stateModel.channel.send(`Team 2: ${t2.join(' ')}`);
  }
}

module.exports = BotCore;
