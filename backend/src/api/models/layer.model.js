const mongoose = require('mongoose');

const LayerSchema = new mongoose.Schema({
    scan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scan',
        required: true
    },
    distances: [{
        type: Number,
        required: true,
        default: [],
    }],
    points: [{}],
});

module.exports = mongoose.model('Layer', LayerSchema);