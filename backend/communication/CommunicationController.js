// SERIAL PORT DEPENDENCIES
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', {baudRate: 9600, autoOpen: false});
const parser = serialPort.pipe(new ReadLine());

// SOCKET DEPENDENCIES
const io = require('socket.io').listen(3002);

// USER DEPENDENCIES
const SOCKET_EVENTS = require("../constants/Constants");
// const SOCKET_EVENTS = Constants.SOCKET_EVENTS;

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

        socket.on(SOCKET_EVENTS.SERIAL_CONNECT, () => {
            serialPort.open(function (err) {
                if (err) {
                    console.log("Error opening serial port");
                    socket.emit(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, err.message);
                } else {
                    console.log("Serial port opened");
                    socket.emit(SOCKET_EVENTS.SERIAL_CONNECT);
                }
            });
        });

        socket.on(SOCKET_EVENTS.SERIAL_DISCONNECT, () => {
            serialPort.close(function (err) {
                console.log("Closing serial port...");
                if (err) {
                    console.log("Error closing serial port.");
                    socket.emit(SOCKET_EVENTS.SERIAL_DISCONNECT_ERROR, err.message);
                } else {
                    console.log("Serial port closed");
                    socket.emit(SOCKET_EVENTS.SERIAL_DISCONNECT);
                }
            });
        });

        // socket.on(constants.START_PROGRAM, () => {
        //     console.log('Program starting...');
        // });
        //
        // socket.on(constants.STOP_PROGRAM, () => {
        //     console.log('Program stopping...');
        // });
    }

    sendSerialData(data) {
        serialPort.write(data);
    }

    sendSocketData(data) {
        io.sockets.emit('broadcast', data);
    }
}

module.exports = CommunicationController;