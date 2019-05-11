const app = require('./api/app');
const server = require('http').createServer(app).listen(3001);

const communicationController = require('./communication/CommunicationController');
const CommunicationController = new communicationController();
