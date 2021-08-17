const mongo = require('../../mongo')
const login = require('../../schemas/login')

module.exports = async (Discord, client, oldPresence, presence) => {

    if(!presence || !presence.member) return;

    let member = presence.member;
    let status = presence.status;
    
    if(oldPresence === undefined) return;
    if(status === undefined) return;

    if(oldPresence.status === status) return;

    if (presence.member.roles.cache.some(r => r.id === '869281781281620008' || r.id === '869609238316601425' || r.id === '869281507133505537')) {

    if(status === 'offline') {

    await mongo().then(async (mongoose) => {
        let profileData;
        try {
            profileData = await login.findOne({userID: member.id})
            if(profileData){
                setTimeout(() => {
                    if(presence.status === 'offline') { 
                        
                    

                    let hadmin = presence.guild.roles.cache.find(r => r.id === "869281781281620008");
                    let admin = presence.guild.roles.cache.find(r => r.id === "869609238316601425");
                    let mod = presence.guild.roles.cache.find(r => r.id === "869281507133505537");       
                    member.roles.remove(hadmin)
                    member.roles.remove(admin)
                    member.roles.remove(mod)

                    member.send(`You have been automatically logged out due to you going offline for more than 30minutes`)
                    
                    let channel = presence.guild.channels.cache.find(r => r.id === '870687321538842634')
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`User logout`)
                    .setDescription(`${member} has logged out`)
                    .setTimestamp()
        
                    channel.send(embed)
                }
                }, /*1800000*/ 5000);
            }
        } catch (err) {
            console.log(err)
        }
    }).then((mongoose) => {
        mongoose.connection.close()
    })
}

}
    

}