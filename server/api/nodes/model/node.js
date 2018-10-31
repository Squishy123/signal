const mongoose = require('mongoose');

//schema for users
const nodeModel = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    clusterId: {type: mongoose.Schema.Types.ObjectId, ref: 'Cluster'},
    currentMeta: {type: mongoose.Schema.Types.ObjectId, ref: 'Meta'},
    historicalMeta: [{type: mongoose.Schema.Types.ObjectId, ref: 'Meta'}], 
    lastUpdated: {type: Date}
});

module.exports = mongoose.model('Node', nodeModel);