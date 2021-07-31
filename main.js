const fs = require('fs');
const Discord = require('discord.js')
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER']});
const {google} = require('googleapis')
require('dotenv').config()

client.commands = new Discord.Collection();

['command', 'event'].forEach(handler => {
    require(`./handler/${handler}`)(client, Discord);
});

const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

client.on('ready', () => {
    console.log(client.user.tag)
    console.log("I am ready")
})
//Please leave this in main.js this is our perspective api
client.on('message', async (message) => {
    const channel = client.channels.cache.get('869532219457273917')
    if(message.author.bot) return;
    google.discoverAPI(DISCOVERY_URL)
    .then(client => {
      const analyzeRequest = {
        comment: {
          text: message.content,
        },
        requestedAttributes: {
          TOXICITY: {},
          IDENTITY_ATTACK: {},
          PROFANITY: {},
          THREAT : {},
          SEXUALLY_EXPLICIT: {},
          FLIRTATION: {},
        },
      };

      client.comments.analyze(
          {
            key: process.env.API_KEY,
            resource: analyzeRequest,
          },
          (err, response) => {
            if (err) throw err;
            //console.log(JSON.stringify(response.data, null, 2));
            //message.channel.send(JSON.stringify(response.data, null, 2))
            let toxic_value = JSON.stringify(response.data.attributeScores.TOXICITY.summaryScore.value, null, 2)
            //TOXIC
            let toxic_percent = toxic_value * 100
            if(toxic_percent > 75) {
                let content = message.content
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setTitle(`TOXIC WARNING (${toxic_percent.toFixed(2)}%) by ${message.author.tag}`)
                .setDescription(`This user has used the sentence \`${content}\``)
                .setTimestamp()
                channel.send(embed)
                message.author.send(`The sentence you sent \`${content}\`, I have deemed this too toxic for our friendly community, please try and be more friendly Thank You`)

            }
            //IDENTITY_ATTACK
            let identity_value = JSON.stringify(response.data.attributeScores.IDENTITY_ATTACK.summaryScore.value, null, 2)
            let identity_percent = identity_value * 100
            if(identity_percent > 75) {
                let content = message.content
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setTitle(`IDENTITY_ATTACK WARNING (${identity_percent.toFixed(2)}%) by ${message.author.tag}`)
                .setDescription(`This user has used the sentence \`${content}\``)
                .setTimestamp()
                channel.send(embed)
                message.author.send(`The sentence you sent \`${content}\`, I have deemed this too personal for our friendly community, please try and be more friendly Thank You`)

            }
            //THREAT
            let threat_value = JSON.stringify(response.data.attributeScores.THREAT.summaryScore.value, null, 2)
            let threat_percent = threat_value * 100
            if(threat_percent > 75) {
                let content = message.content
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setTitle(`THREAT WARNING (${threat_percent.toFixed(2)}%) by ${message.author.tag}`)
                .setDescription(`This user has used the sentence \`${content}\``)
                .setTimestamp()
                channel.send(embed)
                message.author.send(`The sentence you sent \`${content}\`, I have deemed this a threat for our friendly community, please try and be more friendly Thank You`)

            }
            //SEXUALLY_EXPLICIT
            let sexual_value = JSON.stringify(response.data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value, null, 2)
            let sexual_percent = sexual_value * 100
            if(sexual_percent > 75) {
                let content = message.content
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setTitle(`SEXUAL WARNING (${sexual_percent.toFixed(2)}%) by ${message.author.tag}`)
                .setDescription(`This user has used the sentence \`${content}\``)
                .setTimestamp()
                channel.send(embed)
                message.author.send(`The sentence you sent \`${content}\`, I have deemed this too sexual for our friendly community, please try and be more friendly Thank You`)

            }
            //PROFANITY
            let profanity_value = JSON.stringify(response.data.attributeScores.PROFANITY.summaryScore.value, null, 2)
            let profanity_percent = profanity_value * 100
            if(profanity_percent > 75) {
                let content = message.content
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setTitle(`PROFANITY WARNING (${profanity_percent.toFixed(2)}%) by ${message.author.tag}`)
                .setDescription(`This user has used the sentence \`${content}\``)
                .setTimestamp()
                channel.send(embed)
                message.author.send(`The sentence you sent \`${content}\`, I have deemed that is has too much profanity for our friendly community, please try and be more friendly Thank You`)

            }
            //FLIRTATION
            let flirtation_value = JSON.stringify(response.data.attributeScores.FLIRTATION.summaryScore.value, null, 2)
            let flirtation_percent = flirtation_value * 100
            if(flirtation_percent > 75) {
                let content = message.content
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setTitle(`FLIRTATION WARNING (${flirtation_percent.toFixed(2)}%) by ${message.author.tag}`)
                .setDescription(`This user has used the sentence \`${content}\``)
                .setTimestamp()
                channel.send(embed)
                message.author.send(`The sentence you sent \`${content}\`, I have deemed that is has too much flirtation for our friendly community, please try and be more friendly Thank You`)

            }
            
          });
    })
    .catch(err => {
      throw err;
    });
})

client.login(process.env.TOKEN)