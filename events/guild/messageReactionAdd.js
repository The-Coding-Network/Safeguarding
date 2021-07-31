const fs = require('fs')

module.exports = async (Discord, client, reaction, user) => {

    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    if(!reaction.message.guild) return;
    const channel = reaction.client.channels.cache.get('869602637211914300')

    if(reaction.emoji.name === '🛑') {
        let ruser = reaction.message.author.tag
        let content = reaction.message.content
        let vuser = user
        let url = reaction.message.url

        reaction.remove()

        const embed = new Discord.MessageEmbed()
        .setTitle(`${ruser} HAS BEEN REPORTED`)
        .setDescription(`The message \`${content}\` was reported\n[Link to message](${url})`)
        .setFooter(`Please address wheather this needs to be proceeded or not`)
        .setTimestamp()

        user.send(`Thank you for reporting, we will deal with this and do the appropiate action.`)

        let guildID = reaction.message.guild.id
        let userID = reaction.message.author.id

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
            channel.send(embed)
            channel.send(`Here are the logs for <${userID}>`, {
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
        }, 2100);
    }
}