const config = require('../config/config.json')
const { google } = require('googleapis')
const moment = require('moment')
const fs = require('fs')

module.exports = (client, Discord) => {
    console.log("Chatmod module has loaded")

    const DISCOVERY_URL = config.discoveryURL

    client.on('message', async (message) => {
        let prefix = process.env.PREFIX
        const channel = client.channels.cache.get('869532219457273917')

        if (message.author.bot) return;


        const prefix2 = '.'
        if (message.content.startsWith(`${prefix}upload`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}addadmin`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}addhadmin`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}addmod`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}bypass`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}login`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}logout`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}passwd`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}changeme`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}changepassword`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}resetpassword`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}removeadmin`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}removehadmin`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix}removemod`)) return message.delete().catch(err => console.log(err));

        if (message.content.startsWith(`${prefix2}kick`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}ban`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}warn`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}unban`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}mute`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}unmute`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}clear`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}purge`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}slowmode`)) return message.delete().catch(err => console.log(err));
        if (message.content.startsWith(`${prefix2}sm`)) return message.delete().catch(err => console.log(err));
        //if(message.content.startsWith(`${prefix2}lockdown`)) return message.delete().catch(err => console.log(err));

        try {
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
                            THREAT: {},
                            SEXUALLY_EXPLICIT: {},
                            FLIRTATION: {},
                        },
                    };

                    client.comments.analyze(
                        {
                            key: "AIzaSyAYrlKWOD-akV1tDyz1n8vpUw5QPI2oD8c",
                            resource: analyzeRequest,
                        },
                        (err, response) => {
                            if (err) throw err;
                            //console.log(JSON.stringify(response.data, null, 2));
                            //message.channel.send(JSON.stringify(response.data, null, 2))
                            let toxic_value = JSON.stringify(response.data.attributeScores.TOXICITY.summaryScore.value, null, 2)
                            //TOXIC
                            let toxic_percent = toxic_value * 100
                            if (toxic_percent > 75) {
                                let content = message.content
                                message.delete().catch(err => console.log(err))
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`TOXIC WARNING (${toxic_percent.toFixed(2)}%) by ${message.author.tag}`)
                                    .setDescription(`This user has used the sentence \`${content}\``)
                                    .setTimestamp()
                                channel.send(embed)
                                message.author.send(`The sentence you sent \`${content}\`, I have deemed this too toxic for our friendly community, please try and be more friendly Thank You`)

                                const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')
                                let msg = `[${d}] [TOXIC](${toxic_percent.toFixed(2)}%) User:${message.author.tag} Content: ${content}\n`
                                fs.appendFile(`./logs/Guild/chat.txt`, msg, (err) => {
                                    if (err) throw err;
                                });
                                fs.appendFile(`./logs/Guild/guild.txt`, msg, (err) => {
                                    if (err) throw err;
                                });

                            }
                            //IDENTITY_ATTACK
                            let identity_value = JSON.stringify(response.data.attributeScores.IDENTITY_ATTACK.summaryScore.value, null, 2)
                            let identity_percent = identity_value * 100
                            if (identity_percent > 75) {
                                let content = message.content
                                message.delete().catch(err => console.log(err))
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`IDENTITY_ATTACK WARNING (${identity_percent.toFixed(2)}%) by ${message.author.tag}`)
                                    .setDescription(`This user has used the sentence \`${content}\``)
                                    .setTimestamp()
                                channel.send(embed)
                                message.author.send(`The sentence you sent \`${content}\`, I have deemed this too personal for our friendly community, please try and be more friendly Thank You`)
                                const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')
                                let msg = `[${d}] [IDENTITY_ATTACK](${toxic_percent.toFixed(2)}%) User:${message.author.tag} Content: ${content}\n`
                                fs.appendFile(`./logs/Guild/chat.txt`, msg, (err) => {
                                    if (err) throw err;
                                });
                                fs.appendFile(`./logs/Guild/guild.txt`, msg, (err) => {
                                    if (err) throw err;
                                });

                            }
                            //THREAT
                            let threat_value = JSON.stringify(response.data.attributeScores.THREAT.summaryScore.value, null, 2)
                            let threat_percent = threat_value * 100
                            if (threat_percent > 75) {
                                let content = message.content
                                message.delete().catch(err => console.log(err))
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`THREAT WARNING (${threat_percent.toFixed(2)}%) by ${message.author.tag}`)
                                    .setDescription(`This user has used the sentence \`${content}\``)
                                    .setTimestamp()
                                channel.send(embed)
                                message.author.send(`The sentence you sent \`${content}\`, I have deemed this a threat for our friendly community, please try and be more friendly Thank You`)

                                const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')
                                let msg = `[${d}] [THREAT](${toxic_percent.toFixed(2)}%) User:${message.author.tag} Content: ${content}\n`
                                fs.appendFile(`./logs/Guild/chat.txt`, msg, (err) => {
                                    if (err) throw err;
                                });
                                fs.appendFile(`./logs/Guild/guild.txt`, msg, (err) => {
                                    if (err) throw err;
                                });

                            }
                            //SEXUALLY_EXPLICIT
                            let sexual_value = JSON.stringify(response.data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value, null, 2)
                            let sexual_percent = sexual_value * 100
                            if (sexual_percent > 75) {
                                let content = message.content
                                message.delete().catch(err => console.log(err))
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`SEXUAL WARNING (${sexual_percent.toFixed(2)}%) by ${message.author.tag}`)
                                    .setDescription(`This user has used the sentence \`${content}\``)
                                    .setTimestamp()
                                channel.send(embed)
                                message.author.send(`The sentence you sent \`${content}\`, I have deemed this too sexual for our friendly community, please try and be more friendly Thank You`)

                                const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')
                                let msg = `[${d}] [SEXUALLY_EXPLICIT](${toxic_percent.toFixed(2)}%) User:${message.author.tag} Content: ${content}\n`
                                fs.appendFile(`./logs/Guild/chat.txt`, msg, (err) => {
                                    if (err) throw err;
                                });
                                fs.appendFile(`./logs/Guild/guild.txt`, msg, (err) => {
                                    if (err) throw err;
                                });

                            }
                            //PROFANITY
                            let profanity_value = JSON.stringify(response.data.attributeScores.PROFANITY.summaryScore.value, null, 2)
                            let profanity_percent = profanity_value * 100
                            if (profanity_percent > 60) {
                                let content = message.content
                                message.delete().catch(err => console.log(err))
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`PROFANITY WARNING (${profanity_percent.toFixed(2)}%) by ${message.author.tag}`)
                                    .setDescription(`This user has used the sentence \`${content}\``)
                                    .setTimestamp()
                                channel.send(embed)
                                message.author.send(`The sentence you sent \`${content}\`, I have deemed that is has too much profanity for our friendly community, please try and be more friendly Thank You`)

                                const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')
                                let msg = `[${d}] [PROFANITY](${toxic_percent.toFixed(2)}%) User:${message.author.tag} Content: ${content}\n`
                                fs.appendFile(`./logs/Guild/chat.txt`, msg, (err) => {
                                    if (err) throw err;
                                });
                                fs.appendFile(`./logs/Guild/guild.txt`, msg, (err) => {
                                    if (err) throw err;
                                });

                            }
                            //FLIRTATION
                            let flirtation_value = JSON.stringify(response.data.attributeScores.FLIRTATION.summaryScore.value, null, 2)
                            let flirtation_percent = flirtation_value * 100
                            if (flirtation_percent > 75) {
                                let content = message.content
                                message.delete().catch(err => console.log(err))
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`FLIRTATION WARNING (${flirtation_percent.toFixed(2)}%) by ${message.author.tag}`)
                                    .setDescription(`This user has used the sentence \`${content}\``)
                                    .setTimestamp()
                                channel.send(embed)
                                message.author.send(`The sentence you sent \`${content}\`, I have deemed that is has too much flirtation for our friendly community, please try and be more friendly Thank You`)

                                const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')
                                let msg = `[${d}] [FLIRTATION](${toxic_percent.toFixed(2)}%) User:${message.author.tag} Content: ${content}\n`
                                fs.appendFile(`./logs/Guild/chat.txt`, msg, (err) => {
                                    if (err) throw err;
                                });
                                fs.appendFile(`./logs/Guild/guild.txt`, msg, (err) => {
                                    if (err) throw err;
                                });

                            }

                        });
                }).catch(err => {
                    console.log(`chatmod error`)
                    //throw err;
                });

        } catch (err) {
            console.log(`chatmod error`)
            //console.log(err)
        }




    })


}

