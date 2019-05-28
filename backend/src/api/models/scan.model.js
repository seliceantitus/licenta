const mongoose = require('mongoose');

let ScanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: null,
    },
    points: [{
        type: Number,
        required: true,
        default: [],
    }],
});

module.exports = mongoose.model('Scan', ScanSchema);