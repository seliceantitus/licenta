const mongoose = require('mongoose');

const LayerSchema = new mongoose.Schema({
    scan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scan',
        required: true
    },
    points: [{
        type: Number,
        required: true,
        default: [],
    }],
});

module.exports = mongoose.model('Layer', LayerSchema);