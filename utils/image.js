const axios = require('axios')
require('dotenv').config()
module.exports = (client, Discord) => {
    console.log("Image module has loaded")
    let badcontent = ``

    client.on('message', (message) => {
        if (message.author.bot) return;
        if (!message.guild) {
            return;
        }

        let badcontent = `Please do not send any images related to nudity, weapons, alcohol or drugs`
        let image = message.attachments.first().url;
        const channel = client.channels.cache.get('869532219457273917')

        const embed = new Discord.MessageEmbed()
        .setTitle(`Image violation`)
        .setDescription(`${message.author.tag} has sent the image [Image](${image})`)
        .setTimestamp()
        .setColor('RED')
        

        

        axios.get('https://api.sightengine.com/1.0/check.json', {
            params: {
                'url': image,
                'models': 'nudity,wad',
                'api_user': process.env.sightengine_api_user,
                'api_secret': process.env.sightengine_api_secret,
            }
        }).then(async function (response) {
            // on success: handle response
            let res = response.data
            let raw = res.nudity.raw
            let safe = res.nudity.safe
            let partial = res.nudity.partial

            if(raw > 0.5){
                await message.delete()
                await message.reply(badcontent)
                await message.author.send(badcontent)
                await channel.send(embed)
                send(client, Discord, `nudity - raw`, image, message)
            }
            if( safe < 0.75){
                await message.delete()
                await message.reply(badcontent)
                await message.author.send(badcontent)
                await channel.send(embed)
                send(client, Discord, `nudity - safe`, image, message)
            }
            if(partial > 0.2){
                await message.delete()
                await message.reply(badcontent)
                await message.author.send(badcontent)
                await channel.send(embed)
                send(client, Discord, `nudity - partial`, image, message)
            }
            if(res.weapon > 0.2){
                await message.delete()
                await message.reply(badcontent)
                await message.author.send(badcontent)
                await channel.send(embed)
                send(client, Discord, `weapon`, image, message)
            }
            if(res.drugs > 0.2){
                await message.delete()
                await message.reply(badcontent)
                await message.author.send(badcontent)
                await channel.send(embed)
                send(client, Discord, `drugs`, image, message)
            }
            if(res.alcohol > 0.2){
                await message.delete()
                await message.reply(badcontent)
                await message.author.send(badcontent)
                await channel.send(embed)
                send(client, Discord, `alcohol`, image, message)
            }
        })
        .catch(function (error) {
            // handle error
            if (error.response) console.log(error.response.data);
            else console.log(error.message);
        });

    })

}

function send(client, Discord, catagory, url, message) {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Image violation from ${message.author.tag}`)
    .setDescription(`${catagory} => [Image](${url})`)
    .setTimestamp()
    .setColor('RED')

    const send = client.users.cache.find(user => user.id === '721416593166303352')

    send.send(embed)


}