const mongoose = require('mongoose');

//schema for users
const userModel = new mongoose.Schema({
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    admin: { type: String, required: true }
})

module.exports = mongoose.model('User', userModel);