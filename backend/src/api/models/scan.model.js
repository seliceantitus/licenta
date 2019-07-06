const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: 'Unnamed',
    },
    sensorStep: {
        type: Number,
        required: true,
    },
    tableStep: {
        type: Number,
        required: true,
    },
    takenOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Scan', ScanSchema);