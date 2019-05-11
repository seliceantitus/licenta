// SERIAL PORT DEPENDENCIES
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', {baudRate: 9600});
const parser = serialPort.pipe(new ReadLine());

// SOCKET DEPENDENCIES
const io = require('socket.io').listen(3002);

class CommunicationController {
    constructor() {
        parser.on('data', data => {
            try {
                const jsonData = JSON.parse(data);
                this.sendSocketData(jsonData);
            } catch (e) {
                console.log(data);
                console.log("Error: ", e);
            }
        });

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
            this.sendSerialData(message);
        })
    }

    sendSerialData(data) {
        serialPort.write(data);
    }

    sendSocketData(data) {
        io.sockets.emit('broadcast', data);
    }
}

module.exports = CommunicationController;