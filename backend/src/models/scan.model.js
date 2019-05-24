const mongoose = require('mongoose');

const server = '127.0.0.1:27017';

mongoose.connect('mongodb://127.0.0.1:27017/Test');

let TestSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    point: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model('Test', TestSchema);