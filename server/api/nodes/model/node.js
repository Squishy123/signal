const mongoose = require('mongoose');

//schema for users
const nodeModel = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    clusterId: {type: mongoose.Schema.Types.ObjectId, ref: 'Cluster'}
});

module.exports = mongoose.model('Node', nodeModel);