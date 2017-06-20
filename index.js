const Discord = require('discord.js');
const BotCore = require('./bo-core');

const token = process.env.TOKEN;
const channelName = process.env.CHANNEL || 'general';
const logger = console;
const client = new Discord.Client({ autoReconnect: true });
const botCore = new BotCore(logger);

client.on('ready', () => {
  logger.log('client is ready');
});

client.on('message', (message) => {
  if (message.channel.type !== 'text' || message.channel.name !== channelName) {
    return;
  }

  if (message.content === 'go') {
    botCore.go();
  }
});

client.login(token);
