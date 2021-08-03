const config = require('../config/config.json')
const msgconfig = require('../config/messages.json')
require('dotenv').config()
const {google} = require('googleapis')
const moment = require('moment')
const fs = require('fs')

//client, Discord, guild, color, title, description, channelID, footer

module.exports = (client, Discord) => {
    console.log("Logger module has loaded")

    let types = {
        text: "Text Channel",
        voice: "Voice Channel",
        null: "No Type",
        news: "News Channel",
        store: "Store Channel",
        category: "Category",
      }

    client.on('channelCreate', (channel) => {
        if(!channel.guild) return;
        let guild = channel.guild
        let color = "GREEN"
        let title = "Channel Created"
        let channelID = config.logging.channelCreate

        let desc = `ChannelName: \`${channel.name}\`\nChannelID: \`${channel.id}\`\nChannelType: \`${types[channel.type]}\`\nChannelParent: \`${channel.parent.name}\``
        
        const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')            
        let msg = `[${d}] Name:${channel.name} ID:${channel.id} Type:${types[channel.type]}\n`
        fs.appendFile(`./logs/Guild/channelCreate.txt`, msg, (err) => {
            if (err) throw err;
        });

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('channelDelete', (channel) => {
        let guild = channel.guild
        let color = "RED"
        let title = "Channel Deleted"
        let channelID = config.logging.channelDelete

        let desc = `ChannelName: \`${channel.name}\`\nChannelID: \`${channel.id}\`\nChannelType: \`${types[channel.type]}\`\nChannelParent: \`${channel.parent.name}\``  
        
        const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')            
        let msg = `[${d}] Name:${channel.name} ID:${channel.id} Type:${types[channel.type]}\n`
        fs.appendFile(`./logs/Guild/channelDelete.txt`, msg, (err) => {
            if (err) throw err;
        });

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('channelPinsUpdate', (channel, time) => {
        let guild = channel.guild
        let color = "ORANGE"
        let title = "Channel Pins Updated"
        let channelID = config.logging.channelPinsUpdate

        let desc = `ChannelName: \`${channel.name}\`\nChannelID: \`${channel.id}\`\nPinned at: ${time}`        

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('channelUpdate', (oldChannel, newChannel) => {
        let channelID = config.logging.channelUpdate
        let color = "ORANGE" 
        let guild = oldChannel.guild
        
        if(oldChannel.name != newChannel.name){
            let title = "Channel Update - Name"
            let desc = `**Old**\nChannelName: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id}\`\n\n**New**\nChannelName: \`${newChannel.name}\`\nChannelID: \`${newChannel.id}\``


            sendmsg(client, Discord, guild, color, title, desc, channelID)

        } else if(oldChannel.type != newChannel.type) {
            let title = "Channel Update - Type"
            let desc = `**Old**\nChannelName: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id}\`\nChannelType: \`${types[oldChannel.type]}\`\n\n**New**\nChannelName: \`${newChannel.name}\`\nChannelID: \`${newChannel.id}\`\nChannelType: \`${types[newChannel.type]}\``


            sendmsg(client, Discord, guild, color, title, desc, channelID)

        } else if(oldChannel.topic != newChannel.topic){
            let title = "Channel Update - Topic"
            let desc = `**Old**\nChannelName: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id}\`\nChannel Topic: \`${oldChannel.topic}\`\n\n**New**\nChannelName: \`${newChannel.name}\`\nChannelID: \`${newChannel.id}\`\nChannelTopic: \`${newChannel.topic}\``


            sendmsg(client, Discord, guild, color, title, desc, channelID)

        } else if(oldChannel.parent != newChannel.parent){
            let title = "Channel Update - Parent"
            let desc = `**Old**\nChannelName: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id}\`\nChannelParent: \`${oldChannel.parent}\`\n\n**New**\nChannelName: \`${newChannel.name}\`\nChannelID: \`${newChannel.id}\`\nChannelParent: \`${newChannel.parent}\``


            sendmsg(client, Discord, guild, color, title, desc, channelID)
        }

       
    })
    client.on('emojiCreate', (emoji) => {
        let guild = emoji.guild
        let color = "GREEN"
        let title = "Emoji Created"
        let channelID = config.logging.emojiCreate || config.logging.defaultLog

        let desc = `EmojiName: \`${emoji.name}\`\nEmojiID: \`${emoji.id}\``       

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('emojiDelete', (emoji) => {
        let guild = emoji.guild
        let color = "RED"
        let title = "Emoji Deleted"
        let channelID = config.logging.emojiDelete || config.logging.defaultLog

        let desc = `EmojiName: \`${emoji.name}\`\nEmojiID: \`${emoji.id}\``   

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('emojiUpdate', (oldEmoji, newEmoji) => {
        let guild = oldEmoji.guild
        let color = "ORANGE"
        let title = "Emoji Updated - Name"
        let channelID = config.logging.emojiUpdate

        let desc = `**Old**\nEmojiName: \`${oldEmoji.name}\`\nEmojiID: \`${oldEmoji.id}\`\n\n**New**\nEmojiName: \`${newEmoji.name}\`\nEmojiID: \`${newEmoji.id}\``   

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('guildBanAdd', (guild, user) => {
        let color = "BLUE"
        let title = "User banned"
        let channelID = config.logging.guildBanAdd

        let desc = `User: \`${user.tag}\` has been banned` 
        
        const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')            
        let msg = `[${d}] ${user.tag}\n`
        fs.appendFile(`./logs/Guild/guildBanAdd.txt`, msg, (err) => {
            if (err) throw err;
        });

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('guildBanRemove', (guild, user) => {
        let color = "BLUE"
        let title = "User unbanned"
        let channelID = config.logging.guildBanRemove

        let desc = `User: \`${user.tag}\` has been unbanned` 
        
        const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')            
        let msg = `[${d}] ${user.tag}\n`
        fs.appendFile(`./logs/Guild/guildBanRemove.txt`, msg, (err) => {
            if (err) throw err;
        });
        

        sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on('guildMemberUpdate', (oldMember, newMember) => {
        let guild = oldMember.guild
        let color = "ORANGE"
        let channelID = config.logging.guildMemberUpdate || config.logging.defaultLog
        
        let channel = guild.channels.cache.find(r => r.id === channelID)

        if(oldMember.nickname != newMember.nickname) {
            let oldnickname = oldMember.nickname || 'none'
            let newnickname = newMember.nickname || 'none'

            let title = "Member Updated - Nickname"
            let desc = `**Old**\nNickname: \`${oldnickname}\`\n\n**New**\nNickname: \`${newnickname}\``

            check(client, newnickname, newMember)


            sendmsg(client, Discord, guild, color, title, desc, channelID)

        }
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            // Creating an embed message.
            const Embed = new Discord.MessageEmbed();
            
            // Looping through the role and checking which role was removed.
            oldMember.roles.cache.forEach(role => {
                if(role.id === '869281781281620008' || role.id === '869609238316601425' || role.id === '869281507133505537') return;
                if (!newMember.roles.cache.has(role.id)) {
                    Embed.setColor("RED");
                    Embed.setTitle(`Member Updated - Roles Removed`)
                    Embed.setAuthor(newMember.user.tag, newMember.user.avatarURL());
                    Embed.addField("Role Removed:", role);
                    Embed.setTimestamp()
                }
            });
            channel.send(Embed)
        }
            
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const Embed = new Discord.MessageEmbed();

            
            // Looping through the role and checking which role was added.
            newMember.roles.cache.forEach(role => {
                if(role.id === '869281781281620008' || role.id === '869609238316601425' || role.id === '869281507133505537') return;
                if (!oldMember.roles.cache.has(role.id)) {
                    Embed.setColor("GREEN");
                    Embed.setTitle(`Member Updated - Roles Added`)
                    Embed.setAuthor(newMember.user.tag, newMember.user.avatarURL());
                    Embed.addField("Role Added:", role);
                    Embed.setTimestamp()
                }
            });
            channel.send(Embed);
        }
    })
    client.on('messageDelete', (message) => {
        let guild = message.guild
        let color = "RED"
        let title = "Message Deleted"
        let channelID = config.logging.messageDelete

        try {

            let prefix = process.env.prefix
            let prefix2 = '!'
            if(message.author.bot) return;
            if(message.content.startsWith(`${prefix}bypass`)) return;
            if(message.content.startsWith(`${prefix}login`)) return;
            if(message.content.startsWith(`${prefix}passwd`)) return;
            if(message.content.startsWith(`${prefix}changeme`)) return;
            if(message.content.startsWith(`${prefix}changepassword`)) return;
            if(message.content.startsWith(`${prefix}resetpassword`)) return;
            if(message.content.startsWith(`${prefix}upload`)) return;
            if(message.content.startsWith(`${prefix2}kick`)) return;
            if(message.content.startsWith(`${prefix2}ban`)) return;
            if(message.content.startsWith(`${prefix2}warn`)) return;
            if(message.content.startsWith(`${prefix2}unban`)) return;
            if(message.content.startsWith(`${prefix2}mute`)) return;
            if(message.content.startsWith(`${prefix2}unmute`)) return;
            if(message.content.startsWith(`${prefix2}clear`)) return;
            if(message.content.startsWith(`${prefix2}purge`)) return;
            if(message.content.startsWith(`${prefix2}slowmode`)) return;
            if(message.content.startsWith(`${prefix2}sm`)) return;
            //if(message.content.startsWith(`${prefix2}lockdown`)) return;
    
    
            let desc = `The message \`${message}\` has been deleted` 

            const d = moment(Date.now()).format('YYYY/MM/DD HH:MM:SS')            
            let msg = `[${d}] ${message}\n`
            fs.appendFile(`./logs/Guild/messageDelete.txt`, msg, (err) => {
                if (err) throw err;
            });
    
            sendmsg(client, Discord, guild, color, title, desc, channelID)

        } catch (err) {
            console.log(err)
        }
    })
    client.on('messageUpdate', (oldMessage, newMessage) => {
        let guild = oldMessage.guild
        let color = "ORANGE"
        let channelID = config.logging.messageUpdate

        try {
            if (oldMessage.author.bot) return;
            if (oldMessage.channel.type !== "text") return;
            if (newMessage.channel.type !== "text") return;
            if (oldMessage.content === newMessage.content) return;
                
    
            let title = "Message Updated"
            let desc = `**Old**\nMessage: \`${oldMessage}\`\n\n**New**\nMessage: \`${newMessage}\``
    
            check2(client, newMessage, newMessage.author)
    
    
            sendmsg(client, Discord, guild, color, title, desc, channelID)

        } catch (err) {
            console.log(err)
        }
    


    })
   client.on('roleCreate', (role) => {
       let guild = role.guild
       let color = "GREEN"
       let title = "Role Created"
       let channelID = config.logging.roleCreate

       let desc = `RoleName: \`${role.name}\`\nRoleID: \`${role.id}\``       

       sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
   client.on('roleDelete', (role) => {
       let guild = role.guild
       let color = "RED"
       let title = "Role Deleted"
       let channelID = config.logging.roleDelete

       let desc = `RoleName: \`${role.name}\`\nRoleID: \`${role.id}\`` 

       sendmsg(client, Discord, guild, color, title, desc, channelID)
    })
    client.on("roleUpdate", (oldRole, newRole) => {
        let guild = oldRole.guild
        let color = "ORANGE"
        let channelID = config.logging.roleUpdate
        let perms = {
"1": "CREATE_INSTANT_INVITE",
"2": "KICK_MEMBERS",
"4": "BAN_MEMBERS",
"8": "ADMINISTRATOR",
"16": "MANAGE_CHANNELS",
"32": "MANAGE_GUILD",
"64": "ADD_REACTIONS",
"128": "VIEW_AUDIT_LOG",
"256": "PRIORITY_SPEAKER",
"1024": "VIEW_CHANNEL",
"1024": "READ_MESSAGES",
"2048": "SEND_MESSAGES",
"4096": "SEND_TTS_MESSAGES",
"8192": "MANAGE_MESSAGES",
"16384": "EMBED_LINKS",
"32768": "ATTACH_FILES",
"65536": "READ_MESSAGE_HISTORY",
"131072": "MENTION_EVERYONE",
"262144": "EXTERNAL_EMOJIS",
"262144": "USE_EXTERNAL_EMOJIS",
"1048576": "CONNECT",
"2097152": "SPEAK",
"4194304": "MUTE_MEMBERS",
"8388608": "DEAFEN_MEMBERS",
"16777216": "MOVE_MEMBERS",
"33554432": "USE_VAD",
"67108864": "CHANGE_NICKNAME",
"134217728": "MANAGE_NICKNAMES",
"268435456": "MANAGE_ROLES",
"268435456": "MANAGE_ROLES_OR_PERMISSIONS",
"536870912": "MANAGE_WEBHOOKS",
"1073741824 ": "MANAGE_EMOJIS",
"CREATE_INSTANT_INVITE": "CREATE_INSTANT_INVITE",
"KICK_MEMBERS": "KICK_MEMBERS",
"BAN_MEMBERS": "BAN_MEMBERS",
"ADMINISTRATOR": "ADMINISTRATOR",
"MANAGE_CHANNELS": "MANAGE_CHANNELS",
"MANAGE_GUILD": "MANAGE_GUILD",
"ADD_REACTIONS": "ADD_REACTIONS",
"VIEW_AUDIT_LOG": "VIEW_AUDIT_LOG",
"PRIORITY_SPEAKER": "PRIORITY_SPEAKER",
"VIEW_CHANNEL": "VIEW_CHANNEL",
"READ_MESSAGES": "READ_MESSAGES",
"SEND_MESSAGES": "SEND_MESSAGES",
"SEND_TTS_MESSAGES": "SEND_TTS_MESSAGES",
"MANAGE_MESSAGES": "MANAGE_MESSAGES",
"EMBED_LINKS": "EMBED_LINKS",
"ATTACH_FILES": "ATTACH_FILES",
"READ_MESSAGE_HISTORY": "READ_MESSAGE_HISTORY",
"MENTION_EVERYONE": "MENTION_EVERYONE",
"EXTERNAL_EMOJIS": "EXTERNAL_EMOJIS",
"USE_EXTERNAL_EMOJIS": "USE_EXTERNAL_EMOJIS",
"CONNECT": "CONNECT",
"SPEAK": "SPEAK",
"MUTE_MEMBERS": "MUTE_MEMBERS",
"DEAFEN_MEMBERS": "DEAFEN_MEMBERS",
"MOVE_MEMBERS": "MOVE_MEMBERS",
"USE_VAD": "USE_VAD",
"CHANGE_NICKNAME": "CHANGE_NICKNAME",
"MANAGE_NICKNAMES": "MANAGE_NICKNAMES",
"MANAGE_ROLES": "MANAGE_ROLES",
"MANAGE_ROLES_OR_PERMISSIONS": "MANAGE_ROLES_OR_PERMISSIONS",
"MANAGE_WEBHOOKS": "MANAGE_WEBHOOKS",
"MANAGE_EMOJIS": "MANAGE_EMOJIS"
 }
          if (oldRole.name !== newRole.name) {

            let title = "Role Updated - Name"
            let desc = `**Old**\nName: \`${oldRole.name}\`\nRoleID: \`${oldRole.id}\`\n\n**New**\nName: \`${newRole.name}\`\nRoleID: \`${newRole.id}\``

            sendmsg(client, Discord, guild, color, title, desc, channelID)
          } else if (oldRole.color !== newRole.color) {
            
            let title = "Role Updated - Color"
            let desc = `**Old**\nName: \`${oldRole.name}\`\nColor: \`${oldRole.color.toString(16)}\`\nRoleID: \`${oldRole.id}\`\n\n**New**\nName: \`${oldRole.name}\`\nColor: \`${newRole.color.toString(16)}\`\nRoleID: \`${newRole.id}\``

            sendmsg(client, Discord, guild, color, title, desc, channelID)

          } else {
            let title = "Role Updated - Permissions"
            let desc = `**Old**\nName: \`${oldRole.name}\`\nPermission: \`${oldRole.permissions.bitfield}\`\nRoleID: \`${oldRole.id}\`\n\n**New**\nName: \`${newRole.name}\`\nPermission: \`${newRole.permissions.bitfield}\`\nRoleID: \`${newRole.id}\``

            sendmsg(client, Discord, guild, color, title, desc, channelID)

          }
      });

function sendmsg(client, Discord, guild, color, title, description, channelID, footer) {
    try {
        let channel = guild.channels.cache.find(r => r.id === channelID || r.id === config.logging.defaultLog )
        const embed = new Discord.MessageEmbed()
        .setColor(color ? color : "BLACK")
        .setTitle(title ? title : "\u200b")
        .setDescription(description ? description : "\u200b")
        .setFooter(footer ? footer : "\u200b")
        .setTimestamp()

        channel.send(embed)
    } catch (err) {
        console.log(err)
    }
}

function check(client, content, user) {
    const channel = client.channels.cache.get('869532219457273917')
    google.discoverAPI(config.discoveryURL)
        .then(client => {
          const analyzeRequest = {
            comment: {
              text: content,
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
                key: "AIzaSyAYrlKWOD-akV1tDyz1n8vpUw5QPI2oD8c",
                resource: analyzeRequest,
              },
              (err, response) => {
                if (err) throw err;
                let toxic_value = JSON.stringify(response.data.attributeScores.TOXICITY.summaryScore.value, null, 2)
                //TOXIC
                let toxic_percent = toxic_value * 100
                if(toxic_percent > 75) {
                    user.send(`[TOXIC] Please change your nickname, i have deemed this inappropriate`)
                    channel.send("[TOXIC] WARNING: Nickname not good " + content)    
                }
                //IDENTITY_ATTACK
                let identity_value = JSON.stringify(response.data.attributeScores.IDENTITY_ATTACK.summaryScore.value, null, 2)
                let identity_percent = identity_value * 100
                if(identity_percent > 75) {
                    user.send(`[IDENTITY_ATTACK] Please change your nickname, i have deemed this inappropriate`)
                    channel.send("[IDENTITY_ATTACK] WARNING: Nickname not good " + content)
                }
                //THREAT
                let threat_value = JSON.stringify(response.data.attributeScores.THREAT.summaryScore.value, null, 2)
                let threat_percent = threat_value * 100
                if(threat_percent > 75) {
                    user.send(`[THREAT] Please change your nickname, i have deemed this inappropriate`)
                    channel.send("[THREAT] WARNING: Nickname not good " + content)
                }
                //SEXUALLY_EXPLICIT
                let sexual_value = JSON.stringify(response.data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value, null, 2)
                let sexual_percent = sexual_value * 100
                if(sexual_percent > 75) {
                    user.send(`[SEXUALLY_EXPLICIT] Please change your nickname, i have deemed this inappropriate`)
                    channel.send("[SEXUALLY_EXPLICIT] WARNING: Nickname not good " + content)
                }
                //PROFANITY
                let profanity_value = JSON.stringify(response.data.attributeScores.PROFANITY.summaryScore.value, null, 2)
                let profanity_percent = profanity_value * 100
                if(profanity_percent > 75) {
                    user.send(`[PROFANITY] Please change your nickname, i have deemed this inappropriate`)
                    channel.send("[PROFANITY] WARNING: Nickname not good " + content)
                }
                //FLIRTATION
                let flirtation_value = JSON.stringify(response.data.attributeScores.FLIRTATION.summaryScore.value, null, 2)
                let flirtation_percent = flirtation_value * 100
                if(flirtation_percent > 75) {
                    user.send(`[FLIRTATION] Please change your nickname, i have deemed this inappropriate `)
                    channel.send("[FLIRTATION] WARNING: Nickname not good " + content)
                }
                
              });
        })
        .catch(err => {
          throw err;
        });
}

function check2(client, message, user) {
    const channel = client.channels.cache.get('869532219457273917')
        if(message.author.bot) return;
        google.discoverAPI(config.discoveryURL)
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
                if(toxic_percent > 75) {
                    let content = message.content
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`TOXIC WARNING (${toxic_percent.toFixed(2)}%) by ${user.tag}`)
                    .setDescription(`This user has used the sentence \`${content}\``)
                    .setTimestamp()
                    channel.send(embed)
                    user.send(`The sentence you sent \`${content}\`, I have deemed this too toxic for our friendly community, please try and be more friendly Thank You`)
    
                }
                //IDENTITY_ATTACK
                let identity_value = JSON.stringify(response.data.attributeScores.IDENTITY_ATTACK.summaryScore.value, null, 2)
                let identity_percent = identity_value * 100
                if(identity_percent > 75) {
                    let content = message.content
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`IDENTITY_ATTACK WARNING (${identity_percent.toFixed(2)}%) by ${user.tag}`)
                    .setDescription(`This user has used the sentence \`${content}\``)
                    .setTimestamp()
                    channel.send(embed)
                    user.send(`The sentence you sent \`${content}\`, I have deemed this too personal for our friendly community, please try and be more friendly Thank You`)
    
                }
                //THREAT
                let threat_value = JSON.stringify(response.data.attributeScores.THREAT.summaryScore.value, null, 2)
                let threat_percent = threat_value * 100
                if(threat_percent > 75) {
                    let content = message.content
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`THREAT WARNING (${threat_percent.toFixed(2)}%) by ${user.tag}`)
                    .setDescription(`This user has used the sentence \`${content}\``)
                    .setTimestamp()
                    channel.send(embed)
                    user.send(`The sentence you sent \`${content}\`, I have deemed this a threat for our friendly community, please try and be more friendly Thank You`)
    
                }
                //SEXUALLY_EXPLICIT
                let sexual_value = JSON.stringify(response.data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value, null, 2)
                let sexual_percent = sexual_value * 100
                if(sexual_percent > 75) {
                    let content = message.content
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`SEXUAL WARNING (${sexual_percent.toFixed(2)}%) by ${user.tag}`)
                    .setDescription(`This user has used the sentence \`${content}\``)
                    .setTimestamp()
                    channel.send(embed)
                    user.send(`The sentence you sent \`${content}\`, I have deemed this too sexual for our friendly community, please try and be more friendly Thank You`)
    
                }
                //PROFANITY
                let profanity_value = JSON.stringify(response.data.attributeScores.PROFANITY.summaryScore.value, null, 2)
                let profanity_percent = profanity_value * 100
                if(profanity_percent > 75) {
                    let content = message.content
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`PROFANITY WARNING (${profanity_percent.toFixed(2)}%) by ${user.tag}`)
                    .setDescription(`This user has used the sentence \`${content}\``)
                    .setTimestamp()
                    channel.send(embed)
                    user.send(`The sentence you sent \`${content}\`, I have deemed that is has too much profanity for our friendly community, please try and be more friendly Thank You`)
    
                }
                //FLIRTATION
                let flirtation_value = JSON.stringify(response.data.attributeScores.FLIRTATION.summaryScore.value, null, 2)
                let flirtation_percent = flirtation_value * 100
                if(flirtation_percent > 75) {
                    let content = message.content
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`FLIRTATION WARNING (${flirtation_percent.toFixed(2)}%) by ${user.tag}`)
                    .setDescription(`This user has used the sentence \`${content}\``)
                    .setTimestamp()
                    channel.send(embed)
                    user.send(`The sentence you sent \`${content}\`, I have deemed that is has too much flirtation for our friendly community, please try and be more friendly Thank You`)
    
                }
                
              });
        })
        .catch(err => {
          throw err;
        });
}


}
