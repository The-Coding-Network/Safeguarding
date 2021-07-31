const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const login = mongoose.Schema({
    userID: reqString,
    headAdmin: reqString,
    admin: reqString,
    mod: reqString,
    password: reqString
    })

    module.exports = mongoose.model('login', login)