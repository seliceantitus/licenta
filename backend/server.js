const app = require('./src/api/app');

const communicationController = require('./src/communication/CommunicationController');
const CommunicationController = new communicationController();

app.set('communicationController', CommunicationController);
const server = require('http').createServer(app).listen(3001);


