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
            try {
                const jsonData = JSON.parse(data);
                console.log(jsonData);
                io.sockets.emit('broadcast', jsonData);
            } catch (e) {
                console.log(data);
                console.log("Error: ", e);
            }
        });
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
            .then(ports => this.serialPorts = ports);

        socket.on(SOCKET_EVENTS.DISCONNECT, () => this.handleSocketDisconnect(socket));
        socket.on(SOCKET_EVENTS.SERIAL_CONNECT, (port) => this.handleSerialConnect(socket, port));
        socket.on(SOCKET_EVENTS.SERIAL_DISCONNECT, () => this.handleSerialDisconnect(socket));
        socket.on(SOCKET_EVENTS.START_SCAN, () => {
        });
        socket.on(SOCKET_EVENTS.STOP_SCAN, () => {
        });
        socket.emit(SOCKET_EVENTS.SERIAL_PORTS, JSON.stringify(this.serialPorts));
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
                socket.emit(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, err.message);
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
}

module.exports = CommunicationController;