const Discord = require('discord.js');
const MessageRouter = require('./src/messageRouter');
const BotCore = require('./src/bo-core');
const Logger = require('./src/logger');

const token = process.env.TOKEN;
const botUserId = process.env.BOTUSERID;
const channelName = process.env.CHANNEL || 'general';
const logger = new Logger('index');
const client = new Discord.Client({ autoReconnect: true });
const botCore = new BotCore(botUserId);
const messageRouter = new MessageRouter(botCore);

logger.log(`token: ${token}`);
logger.log(`bot user ID: ${botUserId}`);
logger.log(`channel name: ${channelName}`);

client.on('ready', () => {
  logger.log('client is ready');
});

client.on('message', (message) => {
  const channel = message.channel;
  if (channel.type !== 'text' || channel.name !== channelName) {
    return;
  }
  logger.log('routeable message');
  messageRouter.route(message);
});

client.on('messageReactionAdd', (reactionObject) => {
  logger.log('reaction added');
  botCore.handleReactionAdd(reactionObject);
});

client.on('messageReactionRemove', (reactionObject) => {
  logger.log('reaction removed');
  botCore.handleReactionRemove(reactionObject);
});

client.login(token);
