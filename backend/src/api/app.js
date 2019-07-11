const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const scan = require('./routes/scan');
const layer = require('./routes/layer');
const app = express();

const ipAddress = '127.0.0.1';
const port = 27017;
const name = '3Duino';
mongoose.connect(`mongodb://${ipAddress}:${port}/${name}`, { useNewUrlParser: true })
    .then(
        () => {
            console.log('Connected to database');
        },
        err => {
            console.log('Could not connect to database: ', err);
        }
    );

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(req);
    next();
});
app.use('/scan', scan);
app.use('/layer', layer);
module.exports = app;