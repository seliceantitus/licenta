const app = require('./src/api/app');

const communicationController = require('./src/communication/CommunicationController');
const CommunicationController = new communicationController();

app.set('communicationController', CommunicationController);
const server = require('http').createServer(app).listen(3001);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown(){
    CommunicationController.shuttingDown();
    console.log('Shutting down...');
}

module.exports = server;