const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')

module.exports = {
    name: 'addmod',
    description: 'Allows a mod to log in',
    async execute(client, message, args, Discord, prefix) {
        message.delete()
        if (!message.member.roles.cache.some(r => r.id === '869281781281620008' || r.id === '869609238316601425' || r.id === '869281507133505537')) {
            message.reply(`You do not have permission to use this command`).then(msg => msg.delete({timeout: 5000}));
            return;
        }
        target = message.mentions.users.first();
        if(!target) return message.reply(`Please add a target user`).then(msg => msg.delete({timeout: 20000}));
        
        const password = "changeme"
        const hashedPassword = await bcrypt.hash(password, 10)

        
        await mongo().then(async (mongoose) => {
            let profileData;
            try {
                profileData = await login.findOne({userID: target.id})
                if(!profileData){
                    const profile = await login.create({
                        userID: target.id,
                        headAdmin: "false",
                        admin: "false",
                        mod: "true",
                        password: hashedPassword
                    });
                    profile.save()

                    const embed2 = new Discord.MessageEmbed()
                    .setTitle(`Welcome to the staff team`)
                    .setDescription(`Please do \`>login changeme\` in the discord server \`${message.guild.name}\`\nPlease do \`>passwd (your new password)\` to change your password`)
                    .setFooter(`Don't worry your password is encrypted even we can't read them`)
                    .setTimestamp()
            
                    target.send(embed2)
                    

                } else {
                    await login.findOneAndUpdate({ userID: target.id }, {
                        admin: "false",
                        mod: "true",
                        headAdmin: "false"
                    })
                    const embed2 = new Discord.MessageEmbed()
                    .setTitle(`You are now a mod`)
                    .setDescription(`You still login like normal just you now will be given the **Mod** role instead`)
                    .setFooter(`Dont worry your password is encrypted even we can read them`)
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
