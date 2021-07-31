const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')

// let hadmin = message.guild.roles.cache.find(r => r.id === "869281781281620008");
// let admin = message.guild.roles.cache.find(r => r.id === "869609238316601425");
// let mod = message.guild.roles.cache.find(r => r.id === "869281507133505537");

module.exports = {
    name: 'passwd',
    aliases: ['changeme', 'changepassword', 'resetpassword'],
    description: 'Changes a users password',
    async execute(client, message, args, Discord, prefix) {
        message.delete()
        const password = args.join(' ')
        if(!password) return message.reply(`Please enter a password`).then(msg => msg.delete({timeout: 20000}));
        
        const hashedPassword = await bcrypt.hash(password, 15)

        if (message.member.roles.cache.some(r => r.id === '869281781281620008' || r.id === '869609238316601425' || r.id === '869281507133505537')) {
            await mongo().then(async (mongoose) => {
                let profileData;
                try {
                    profileData = await login.findOne({userID: message.author.id})
                    if(!profileData){
                        
                        return;
    
                    } else {
                        await login.findOneAndUpdate({ userID: message.author.id }, {
                            password: hashedPassword
                        })
                        message.reply("You password has been updated").then(msg => msg.delete({timeout: 20000}));
                    }
                } catch (err) {
                    console.log(err)
                    mongoose.connection.close()
                } finally {
                    mongoose.connection.close()
                }
            })            
        } else {
            message.reply(`Please make sure you have logged in using the >login command, enter your password after that if your new your password is "changeme"`).then(msg => msg.delete({timeout: 20000}));
        }

        

    }
}