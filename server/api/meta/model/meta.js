const mongoose = require('mongoose');

//schema for users
const metaModel = new mongoose.Schema({
    nodeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Node'},
    readingName: {type: String, required: true, index: {unique: true}},
    readingValue: {type: String, required: true, index: {unique: true}},
    unit: {type: String, required: true, index: {unique: true}},
    createdAt: {type: Date, required: true}
});

module.exports = mongoose.model('Meta', metaModel);