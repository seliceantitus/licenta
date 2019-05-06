const SerialController = require("../serial/serialController");
const io = require('socket.io').listen(3002);

class SocketController {
    constructor() {
        this.connections = [];
        io.sockets.on('connection', (socket) => this.handleClientConnection(socket));
        console.log('Socket created successfully');
    }

    handleClientConnection(socket) {
        this.connections.push(socket);
        console.log('Connected: %s sockets connected', this.connections.length);

        socket.on('disconnect', () => {
            this.connections.splice(this.connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', this.connections.length);
        });

        socket.on('client_data', (message) => {
            console.log(message);
            // SerialController.sendData(message);
        })
    }

    sendData(data){
        io.sockets.emit('broadcast', data);
    }
}

module.exports = SocketController;
