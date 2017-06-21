const GameStateModel = require('./gameStateModel');
const Logger = require('./logger');
const Emoji = require('./emoji');
const Utils = require('./utils');

const teamSize = 2;
const gameTimeoutInterval = 3 * 60 * 1000;
const WELCOME_MESSAGE_BASE = '@here Emoji this message to join upcoming game';

class BotCore {
  constructor(botUserId) {
    this.stateModel = new GameStateModel(botUserId);
    this.logger = new Logger('BotCore');
  }

  go(message) {
    const channel = message.channel;
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
    this.stateModel.autoSignedPlayer = message.author;
    this.stateModel.gameTimeoutId = setTimeout(() => {
      this.gameTimeout();
    }, gameTimeoutInterval);

    this.stateModel.channel.send(WELCOME_MESSAGE_BASE).then((m) => {
      this.stateModel.welcomeMessage = m;
      m.react(Emoji.EGGPLANT);
      m.react(Emoji.HEART_EYES);
      m.react(Emoji.RUNNING_GHOST);
      m.react(Emoji.THUMBS_UP);
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
    this.reset();
  }

  gameTimeout() {
    this.logger.log('game request timed out, cancelling game');
    this.stateModel.channel.send('Game request timed out. Not enough players.');
    this.reset();
  }

  reset() {
    if (this.stateModel.gameTimeoutId >= 0) {
      clearTimeout(this.stateModel.gameTimeoutId);
    }
    this.stateModel.clear();
  }

  handleReactionAdd(reactionObject) {
    if (!this.stateModel.constructingTeams) {
      return;
    }
    if (!this.stateModel.welcomeMessage || this.stateModel.welcomeMessage.id !== reactionObject.message.id) {
      return;
    }
    this.updateTeams(reactionObject.message.reactions);
    this.updateWelcomeMessage();
    this.checkTeamComplete();
  }

  handleReactionRemove(reactionObject) {
    if (!this.stateModel.constructingTeams) {
      return;
    }
    if (!this.stateModel.welcomeMessage || this.stateModel.welcomeMessage.id !== reactionObject.message.id) {
      return;
    }
    this.updateTeams(reactionObject.message.reactions);
    this.updateWelcomeMessage();
    this.checkTeamComplete();
  }

  updateTeams(reactions) {
    this.stateModel.requests = {};
    this.stateModel.requests[this.stateModel.autoSignedPlayer.id] = this.stateModel.autoSignedPlayer;
    for (const r of reactions.array()) {
      for (const u of r.users.array()) {
        if (u.id !== this.stateModel.botUserId) {
          this.stateModel.requests[u.id] = u;
          this.logger.log(`accepting request from player ${u.id}`);
        } else {
          this.logger.log(`rejecting request from player ${u.id}`);
        }
      }
    }
  }

  updateWelcomeMessage() {
    const requests = [];
    const keys = Object.keys(this.stateModel.requests);
    for (const k of keys) {
      requests.push(this.stateModel.requests[k].username);
    }
    const signInStr = requests.length > 0 ? requests.join(', ') : 'no one yet'
    this.stateModel.welcomeMessage.edit(`${WELCOME_MESSAGE_BASE}, signed in: ${signInStr}`);
  }

  checkTeamComplete() {
    const keys = Object.keys(this.stateModel.requests);
    if (keys.length >= teamSize * 2) {
      this.logger.log('teams are ready');
      this.printOutTeam(this.stateModel.requests);
      this.stateModel.clear();
    } else {
      this.logger.log(`teams are not ready yet, ${keys.length} applied, ${(teamSize * 2) - keys.length} to go`);
    }
  }

  printOutTeam(requests) {
    const keys = Object.keys(requests).slice(0, teamSize * 2);
    const t1 = keys.slice(0, teamSize).map(e => `<@${e}>`);
    const t2 = keys.slice(teamSize).map(e => `<@${e}>`);
    this.logger.log(`team #1: ${t1}, team #2: ${t2}`);
    this.stateModel.channel.send(`Teams are ready! ${t1.join(' + ')} vs ${t2.join(' + ')}`);
  }
}

module.exports = BotCore;
