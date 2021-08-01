const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')

module.exports = {
    name: 'login',
    description: 'Allows staff members to log in',
    async execute(client, message, args, Discord, prefix) {

        message.delete()
        const password = args.join(' ')
        if(!password) return message.reply(`Please enter your password`).then(msg => msg.delete({timeout: 20000}));
        let member = message.guild.members.cache.get(message.author.id)

        let hadmin = message.guild.roles.cache.find(r => r.id === "869281781281620008");
        let admin = message.guild.roles.cache.find(r => r.id === "869609238316601425");
        let mod = message.guild.roles.cache.find(r => r.id === "869281507133505537");

        
        await mongo().then(async (mongoose) => {
            let profileData;
            try {
                profileData = await login.findOne({userID: message.author.id})
                if(!profileData){
                    
                    message.reply("You have entered the wrong password or are not allowed to login, please check your spelling").then(msg => msg.delete({timeout: 20000}));
                    
                } else {
                    if(await bcrypt.compare(password, profileData.password)) {

                        if(profileData.headAdmin === 'true'){
                            member.roles.add(hadmin)
                            message.reply("You are logged in").then(msg => msg.delete({timeout: 20000}));
                            let channel = message.guild.channels.cache.find(r => r.id === '870687321538842634')
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`User login`)
                            .setDescription(`${member} has logged in`)
                            .setTimestamp()
                
                            channel.send(embed)
                            return;
                        } else if(profileData.admin === 'true'){
                            member.roles.add(admin)
                            message.reply("You are logged in").then(msg => msg.delete({timeout: 20000}));
                            let channel = message.guild.channels.cache.find(r => r.id === '870687321538842634')
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`User login`)
                            .setDescription(`${member} has logged in`)
                            .setTimestamp()
                
                            channel.send(embed)
                            return;
                        } else if(profileData.mod === 'true') {
                            member.roles.add(mod)
                            message.reply("You are logged in").then(msg => msg.delete({timeout: 20000}));
                            let channel = message.guild.channels.cache.find(r => r.id === '870687321538842634')
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`User login`)
                            .setDescription(`${member} has logged in`)
                            .setTimestamp()
                
                            channel.send(embed)
                            return;
                        } else {
                            message.reply("You have entered the wrong password or are not allowed to login, please check your spelling").then(msg => msg.delete({timeout: 20000}));
                        }
                    } else {
                        message.reply("You have entered the wrong password or are not allowed to login, please check your spelling").then(msg => msg.delete({timeout: 20000}));
                    }
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