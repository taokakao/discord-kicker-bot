const Discord = require('discord.js');
const BotCore = require('./bo-core');

const token = process.env.TOKEN;
const botUserId = process.env.BOTUSERID;
const channelName = process.env.CHANNEL || 'general';
const logger = console;
const client = new Discord.Client({ autoReconnect: true });
const botCore = new BotCore(logger, botUserId);

client.on('ready', () => {
  logger.log('client is ready');
});

client.on('message', (message) => {
  const channel = message.channel;
  if (channel.type !== 'text' || channel.name !== channelName) {
    return;
  }

  if (message.content === 'go') {
    botCore.go(channel);
  }

  if (message.content === 'cancel') {
    botCore.cancel();
  }
});

client.on('messageReactionAdd', (reactionObject) => {
  botCore.handleReactionAdd(reactionObject);
});

client.on('messageReactionRemove', (reactionObject) => {
  botCore.handleReactionRemove(reactionObject);
});

client.login(token);
