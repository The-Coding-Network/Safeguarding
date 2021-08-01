const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')

module.exports = {
    name: 'removemod',
    description: 'Does not allow a mod to log in',
    async execute(client, message, args, Discord, prefix) {
        message.delete()
        if (!message.member.roles.cache.some(r => r.id === '869281781281620008' || r.id === '869609238316601425' || r.id === '869281507133505537')) {
            message.reply(`You do not have permission to use this command`).then(msg => msg.delete({timeout: 5000}));
            return;
        }
        target = message.mentions.users.first();
        if(!target) return message.reply(`Please add a target user`).then(msg => msg.delete({timeout: 20000}));
        
        let member = message.guild.members.cache.get(target.id)
        let hadmin = message.guild.roles.cache.find(r => r.id === "869281781281620008");
        let admin = message.guild.roles.cache.find(r => r.id === "869609238316601425");
        let mod = message.guild.roles.cache.find(r => r.id === "869281507133505537");       
        member.roles.remove(hadmin)
        member.roles.remove(admin)
        member.roles.remove(mod)

        
        await mongo().then(async (mongoose) => {
            let profileData;
            try {
                profileData = await login.findOne({userID: target.id})
                if(!profileData){
                    const profile = await login.create({
                        userID: target.id,
                        headAdmin: "false",
                        admin: "false",
                        mod: "false",
                        password: hashedPassword
                    });
                    profile.save()
                    

                } else {
                    await login.findOneAndUpdate({ userID: target.id }, {
                        admin: "false",
                        mod: "false",
                        headAdmin: "false"
                    })
                    const embed2 = new Discord.MessageEmbed()
                    .setTitle(`You have been removed from the staff team`)
                    .setDescription(`You no longer have access to your staff privileges, the >login command will no longer work`)
                    .setFooter(`Please message the staff team if you think this is incorrect`)
                    .setTimestamp()
            
                    target.send(embed2)
                }
            } catch (err) {
                console.log(err)
                mongoose.connection.close()
            } finally {
                mongoose.connection.close()
            }
        })
        

    }
}
