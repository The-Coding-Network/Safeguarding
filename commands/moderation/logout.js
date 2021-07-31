const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')

//.then(msg => msg.delete({timeout: 20000}));
module.exports = {
    name: 'logout',
    description: 'Logout a user',
    async execute(client, message, args, Discord, prefix) {
        message.delete()
        
        let hadmin = message.guild.roles.cache.find(r => r.id === "869281781281620008");
        let admin = message.guild.roles.cache.find(r => r.id === "869609238316601425");
        let mod = message.guild.roles.cache.find(r => r.id === "869281507133505537");
        

        let member = message.guild.members.cache.get(message.author.id)

        if (message.member.roles.cache.some(r => r.id === '869281781281620008' || r.id === '869609238316601425' || r.id === '869281507133505537')) {
            let channel = message.guild.channels.cache.find(r => r.id === '870687321538842634')
            const embed = new Discord.MessageEmbed()
            .setTitle(`User logout`)
            .setDescription(`${member} has logged out`)
            .setTimestamp()

            channel.send(embed)

        }

        member.roles.remove(hadmin)
        member.roles.remove(admin)
        member.roles.remove(mod)
        


        

    }
}