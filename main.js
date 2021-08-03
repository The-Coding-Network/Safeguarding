const fs = require('fs');
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] });
require('dotenv').config()
const config = require('./config/config.json')
const msgconfig = require('./config/messages.json')
const uuid = require('uuid').v4

client.commands = new Discord.Collection();

const handler_files = fs.readdirSync(`./handler`).filter(file => file.endsWith('.js'));

for (const file of handler_files) {
  const handler = require(`./handler/${file}`)
  handler(client, Discord)
}

client.on('ready', () => {
  console.log(`${client.user.tag} || I am ready`)
})

client.login(process.env.TOKEN)

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);