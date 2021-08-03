const fs = require('fs');
const Discord = require('discord.js')
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER']});
require('dotenv').config()
const config = require('./config/config.json')
const msgconfig = require('./config/messages.json')

client.commands = new Discord.Collection();

const handler_files = fs.readdirSync(`./handler`).filter(file => file.endsWith('.js'));

for(const file of handler_files) {
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

const moment = require('moment')
const d = moment(Date.now()).format('YYYY-MM-DD-HH')

sendfiles()




async function sendfiles() {
  const files = fs.readdirSync(`./logs/Guild`).filter(file => file.endsWith('.txt'));

  var ftpClient = require('ftp-client'),
  config23 = {
      host: 'ftpupload.net',
      port: 21,
      user: 'epiz_29303696',
      password: process.env.FTP_PASSWORD
  },
  options = {
      logging: 'basic'
  },
  aclient = new ftpClient(config23, options);

aclient.connect(async function () {

  await aclient.upload([`logs/**`], `/htdocs/logs/${d}`, {
      baseDir: 'logs',
      overwrite: 'older'
  }, function (result) {
      //console.log(result);
  });
  setTimeout(() => {

    for(const file of files) {
      if(file === 'tmp.txt') return;
      fs.unlink(`./logs/Guild/${file}`, (err) => {
        if (err) {
            console.error(err)
            return;
        }
    })
    }

  }, 2000)

});
  setTimeout(async() => {
    sendfiles()
  }, 60000 * 12 * 60)
}