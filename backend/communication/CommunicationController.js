// SERIAL PORT DEPENDENCIES
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', {baudRate: 9600, autoOpen: false});
const parser = serialPort.pipe(new ReadLine());

// SOCKET DEPENDENCIES
const io = require('socket.io').listen(3002);

// USER DEPENDENCIES
const SOCKET_EVENTS = require("../constants/Constants");

class CommunicationController {
    constructor() {
        parser.on('data', data => {
            try {
                const jsonData = JSON.parse(data);
                io.sockets.emit('broadcast', jsonData);
            } catch (e) {
                console.log(data);
                console.log("Error: ", e);
            }
        });

        this.connections = [];
        io.sockets.on('connection', (socket) => this.handleClientConnection(socket));

        this.serial = {
            connected: false,
        };

        this.scan = {
            running: false,
            paused: false,
            stopped: false
        };

        this.serialCachedData = {
            inbound: [],
            outbound: [],
        };

        this.socketCachedData = {
            inbound: [],
            outbound: [],
        };

        this.handleClientConnection = this.handleClientConnection.bind(this);
        this.handleSocketDisconnect = this.handleSocketDisconnect.bind(this);
        this.handleSerialConnect = this.handleSerialConnect.bind(this);
        this.handleSerialDisconnect = this.handleSerialDisconnect.bind(this);
    }

    handleClientConnection(socket) {
        this.connections.push(socket);
        socket.on(SOCKET_EVENTS.DISCONNECT, () => this.handleSocketDisconnect(socket));
        socket.on(SOCKET_EVENTS.SERIAL_CONNECT, () => this.handleSerialConnect(socket));
        socket.on(SOCKET_EVENTS.SERIAL_DISCONNECT, () => this.handleSerialDisconnect(socket));
        socket.on(SOCKET_EVENTS.START_SCAN, () => {
        });
        socket.on(SOCKET_EVENTS.STOP_SCAN, () => {
        });
    }

    handleSocketDisconnect(socket) {
        this.connections.splice(this.connections.indexOf(socket), 1);
        if (this.serial.connected) {
            serialPort.close((err) => {
                if (!err) {
                    this.serial.connected = false;
                }
            });
        }
    }

    handleSerialConnect(socket) {
        serialPort.open((err) => {
            if (err) {
                socket.emit(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, err.message);
            } else {
                this.serial.connected = true;
                socket.emit(SOCKET_EVENTS.SERIAL_CONNECT);
            }
        });
    }

    handleSerialDisconnect(socket) {
        serialPort.close((err) => {
            if (err) {
                socket.emit(SOCKET_EVENTS.SERIAL_DISCONNECT_ERROR, err.message);
            } else {
                this.serial.connected = false;
                socket.emit(SOCKET_EVENTS.SERIAL_DISCONNECT);
            }
        });
    }
}

module.exports = CommunicationController;