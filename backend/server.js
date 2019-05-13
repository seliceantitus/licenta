const app = require('./api/app');
const communicationController = new (require('./communication/CommunicationController'))();
app.set('communicationController', communicationController);
const server = require('http').createServer(app).listen(3001);

// const CommunicationController = new communicationController();
