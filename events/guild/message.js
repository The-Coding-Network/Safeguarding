require('dotenv').config
const fs = require('fs')

module.exports = async (Discord, client, message) => {
    let prefix = process.env.PREFIX
    const member = message.member
    if(message.author.bot) return;
    if(!message.guild) {
        //modmail?
        return;
    }
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    try {
        if(command) command.execute(client, message, args, Discord, prefix);
    } catch (err) {
        message.reply("Sorry there is a problem executing that command, please try again later");
    }
}
