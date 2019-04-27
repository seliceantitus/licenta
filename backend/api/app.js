const express = require('express');
const scan = require('./routes/scan');
const history = require('./routes/history');

const app = express();

app.use('/scan', scan);
app.use('/history', history);

module.exports = app;