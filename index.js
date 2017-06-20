const Discord = require('discord.js');

const token = process.env.TOKEN;
const channelName = process.env.CHANNEL || 'general';
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login(token);
