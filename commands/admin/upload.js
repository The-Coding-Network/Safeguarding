const fs = require('fs')
const bcrypt = require('bcrypt')
const mongo = require('../../mongo')
const login = require('../../schemas/login')
const moment = require('moment')
const uuid = require('uuid').v4


module.exports = {
    name: 'upload',
    description: 'Uploads log files',
    async execute(client, message, args, Discord, prefix) {
        const d = moment(Date.now()).format('YYYY-MM-DD-HH-MM')
        message.delete()
        if (!message.member.roles.cache.some(r => r.id === '869281781281620008' || r.id === '869609238316601425' || r.id === '869281507133505537')) {
            message.raeply(`You do not have permission to use this command`).then(msg => msg.delete({ timeout: 5000 }));
            return;
        }
        const files = fs.readdirSync(`./logs/Guild`).filter(file => file.endsWith('.txt'));

        var ftpClient = require('ftp-client'),
            config23 = {
                host: 'ftpupload.net',
                port: 21,
                user: 'epiz_29303696',
                password: process.env.FTP_PASSWORD
            },
            options = {
                logging: 'basic'
            },
            aclient = new ftpClient(config23, options);

        aclient.connect(async function () {

            await aclient.upload([`logs/**`], `/htdocs/logs/Guild/${uuid()}`, {
                baseDir: 'logs',
                overwrite: 'older'
            }, function (result) {
                console.log(result);
            });
            setTimeout(() => {

                for (const file of files) {
                    if (file === 'tmp.txt') return;
                    fs.unlink(`./logs/Guild/${file}`, (err) => {
                        if (err) {
                            console.error(err)
                            return;
                        }
                    })
                }

            }, 30000)
        })


   }
}
