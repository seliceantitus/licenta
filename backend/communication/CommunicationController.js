// SERIAL PORT DEPENDENCIES
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;


// SOCKET DEPENDENCIES
const io = require('socket.io').listen(3002);

// USER DEPENDENCIES
const SOCKET_EVENTS = require("../constants/Constants");

class CommunicationController {
    constructor() {
        this.serialPorts = [];
        this.getSerialPortsList().then(ports => this.serialPorts = ports);

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

        this.createSerialPort = this.createSerialPort.bind(this);
        this.getSerialPortsList = this.getSerialPortsList.bind(this);
        this.handleClientConnection = this.handleClientConnection.bind(this);
        this.handleSocketDisconnect = this.handleSocketDisconnect.bind(this);
        this.handleSerialConnect = this.handleSerialConnect.bind(this);
        this.handleSerialDisconnect = this.handleSerialDisconnect.bind(this);
    }

    createSerialPort(port) {
        if (this.serial.connected) this.handleSerialDisconnect();
        this.serialPort = new SerialPort(port, {baudRate: 9600, autoOpen: false});
        this.parser = this.serialPort.pipe(new ReadLine());
        this.parser.on('data', data => {
            this.logger(data);
            try {
                const jsonData = JSON.parse(data);
                switch (jsonData.component) {
                    case SOCKET_EVENTS.AR_CONFIG:
                        io.sockets.emit(SOCKET_EVENTS.CONFIG, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_START_SCAN:
                        io.sockets.emit(SOCKET_EVENTS.START_SCAN, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_PAUSE_SCAN:
                        io.sockets.emit(SOCKET_EVENTS.PAUSE_SCAN, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_STOP_SCAN:
                        io.sockets.emit(SOCKET_EVENTS.STOP_SCAN, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_ERROR:
                        io.sockets.emit(SOCKET_EVENTS.ERROR, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_MOTOR:
                        io.sockets.emit(SOCKET_EVENTS.MOTOR, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_PROGRAM:
                        io.sockets.emit(SOCKET_EVENTS.PROGRAM, jsonData);
                        break;
                    case SOCKET_EVENTS.AR_SENSOR:
                        io.sockets.emit(SOCKET_EVENTS.SENSOR, jsonData);
                        break;
                    default:
                        io.socket.emit(SOCKET_EVENTS.ERROR)
                }
            } catch (e) {
                this.logger(e);
                io.sockets.emit(SOCKET_EVENTS.ERROR);
            }
        });
    }

    logger(message) {
        console.log(Date.now(), message);
    }

    async getSerialPortsList() {
        let portsList = await SerialPort.list();
        return portsList
            .filter(port => port.comName.toLowerCase() !== 'com1')
            .map(port => port.comName);
    };

    handleClientConnection(socket) {
        this.connections.push(socket);
        this.getSerialPortsList()
            .then(ports => {
                socket.emit(SOCKET_EVENTS.SERIAL_PORTS, JSON.stringify(ports));
                this.serialPorts = ports;
            });

        socket.on(SOCKET_EVENTS.DISCONNECT, () => this.handleSocketDisconnect(socket));
        socket.on(SOCKET_EVENTS.SERIAL_CONNECT, (port) => this.handleSerialConnect(socket, port));
        socket.on(SOCKET_EVENTS.SERIAL_DISCONNECT, () => this.handleSerialDisconnect(socket));
        socket.on(SOCKET_EVENTS.CONFIG, () => {});
        socket.on(SOCKET_EVENTS.START_SCAN, () => {this.handleStartScan()});
        socket.on(SOCKET_EVENTS.PAUSE_SCAN, () => {this.handlePauseScan()});
        socket.on(SOCKET_EVENTS.STOP_SCAN, () => {this.handleStopScan()});
    }

    handleSocketDisconnect(socket) {
        this.connections.splice(this.connections.indexOf(socket), 1);
        if (this.serial.connected) {
            this.serialPort.close((err) => {
                if (!err) {
                    this.serial.connected = false;
                }
            });
        }
    }

    handleSerialConnect(socket, port) {
        this.createSerialPort(port);
        this.serialPort.open((err) => {
            if (err) {
                socket.emit(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, {error: err.message, port: port});
            } else {
                this.serial.connected = true;
                socket.emit(SOCKET_EVENTS.SERIAL_CONNECT);
            }
        });
    }

    handleSerialDisconnect(socket) {
        this.serialPort.close((err) => {
            if (err) {
                socket.emit(SOCKET_EVENTS.SERIAL_DISCONNECT_ERROR, err.message);
            } else {
                this.serial.connected = false;
                socket.emit(SOCKET_EVENTS.SERIAL_DISCONNECT);
            }
        });
    }

    handleStartScan() {
        const command = JSON.stringify({command: SOCKET_EVENTS.AR_START_SCAN});
        this.logger(command);
        this.serialPort.write(command);
    }

    handlePauseScan() {
        const command = JSON.stringify({command: SOCKET_EVENTS.AR_PAUSE_SCAN});
        this.logger(command);
        this.serialPort.write(command);
    }

    handleStopScan() {
        const command = JSON.stringify({command: SOCKET_EVENTS.AR_STOP_SCAN});
        this.logger(command);
        this.serialPort.write(command);
    }
}

module.exports = CommunicationController;