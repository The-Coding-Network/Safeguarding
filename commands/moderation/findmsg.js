const fs = require('fs')
module.exports = {
    name: 'findmsg',
    description: 'Gets the last messages from each channel',
    async execute(client, message, args, Discord, prefix) {
        let guildID = message.guild.id
        let userID = message.mentions.users.first() || args[0]
        await client.guilds.cache.get(guildID).channels.cache.forEach(ch => {
            if (ch.type === 'text'){
                ch.messages.fetch({
                    limit: 100
                }).then(async messages => {
                    const msgs = messages.filter(m => m.author.id === userID)
                    msgs.forEach(m => {
                        fs.appendFile(`./logs/log_${userID}.txt`, `[${m.content}] in channel  [${m.channel.name}]\n`, (err) => {
                            if (err) throw err;
                          });
                    })

                })
            } else {
                return;
            }

        })
        setTimeout(() => {
            message.channel.send(`Here are the logs for <${userID}>`, {
                files: [
                    `./logs/log_${userID}.txt`
                ]
            })            
        }, 2000);
        setTimeout(() => {
            fs.unlink(`./logs/log_${userID}.txt`, (err) => {
                if (err) {
                    console.error(err)
                    return;
                }
            })            
        }, 5000);


    }
}