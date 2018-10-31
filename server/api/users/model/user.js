const mongoose = require('mongoose');

//schema for users
const userModel = new mongoose.Schema({
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    scope: { type: String, required: true },
    clusters: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cluster'}]
})

module.exports = mongoose.model('User', userModel);