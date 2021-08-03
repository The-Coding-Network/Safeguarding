const fs = require('fs');

module.exports = (client, Discord) => {

    const util_files = fs.readdirSync(`./utils/`).filter(file => file.endsWith('.js'));

    for(const file of util_files) {
      const utilf = require(`../utils/${file}`)  
      utilf(client, Discord)
    }

}