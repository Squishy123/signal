const mongoose = require('mongoose');

//schema for users
const clusterModel = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    nodes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}]
});

module.exports = mongoose.model('Cluster', clusterModel);