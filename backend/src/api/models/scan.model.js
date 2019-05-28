const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: 'Unnamed',
    },
});

module.exports = mongoose.model('Scan', ScanSchema);