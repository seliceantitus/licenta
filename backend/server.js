const app = require('./src/api/app');
const communicationController = new (require('./src/communication/CommunicationController'))();
app.set('communicationController', communicationController);
const server = require('http').createServer(app).listen(3001);

// const CommunicationController = new communicationController();
