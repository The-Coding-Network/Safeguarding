const mongoose = require('mongoose');
require('dotenv').config();

const mongoPath = process.env.MONGODB_SRV

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    }).catch((err) => {
        console.log(err);
      })
}