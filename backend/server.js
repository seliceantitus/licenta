const app = require('./api/app');
const server = require('http').createServer(app).listen(3001);

const socketController = require('./socket/socketController');
const SocketController = new socketController();

const serialController = require('./serial/serialController');
const SerialController = new serialController(SocketController);

