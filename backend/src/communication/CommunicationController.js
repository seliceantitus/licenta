// SERIAL PORT DEPENDENCIES
const SerialPort = require('serialport/lib');
const ReadLine = SerialPort.parsers.Readline;


// SOCKET DEPENDENCIES
const io = require('socket.io').listen(3002);

// USER DEPENDENCIES
const Constants = require("../constants/Constants");
const{SOCKET_EVENTS, REQUEST, RESPONSE, ARDUINO_REQUEST, ARDUINO_RESPONSE, ARDUINO_ERRORS} = Constants;

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
            try {
                const jsonData = JSON.parse(data);
                this.logger(`[SERIAL IN] ${data}`);
                switch (jsonData.component) {
                    case ARDUINO_RESPONSE.AR_CONFIG:
                        io.sockets.emit(RESPONSE.CONFIG_SUCCESS, jsonData);
                        break;
                    case ARDUINO_RESPONSE.AR_START_SCAN:
                        io.sockets.emit(RESPONSE.START_SCAN, jsonData);
                        break;
                    case ARDUINO_RESPONSE.AR_PAUSE_SCAN:
                        io.sockets.emit(RESPONSE.PAUSE_SCAN, jsonData);
                        break;
                    case ARDUINO_RESPONSE.AR_STOP_SCAN:
                        io.sockets.emit(RESPONSE.STOP_SCAN, jsonData);
                        break;
                    case ARDUINO_RESPONSE.AR_ERROR:
                        io.sockets.emit(RESPONSE.ERROR, {message: ARDUINO_ERRORS[jsonData.message].MESSAGE});
                        break;
                    case ARDUINO_RESPONSE.AR_MOTOR:
                        io.sockets.emit(RESPONSE.MOTOR, jsonData);
                        break;
                    case ARDUINO_RESPONSE.AR_PROGRAM:
                        io.sockets.emit(RESPONSE.PROGRAM, jsonData);
                        break;
                    case ARDUINO_RESPONSE.AR_SENSOR:
                        io.sockets.emit(RESPONSE.SENSOR, jsonData);
                        break;
                    default:
                        io.socket.emit(RESPONSE.ERROR)
                }
            } catch (e) {
                this.logger(e);
                io.sockets.emit(RESPONSE.ERROR);
            }
        });
    }

    logger(message) {
        console.log(new Date().toString(), message);
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
                socket.emit(RESPONSE.SERIAL_PORTS, JSON.stringify(ports));
                this.serialPorts = ports;
            });

        socket.on(SOCKET_EVENTS.DISCONNECT, () => this.handleSocketDisconnect(socket));
        socket.on(REQUEST.SERIAL_CONNECT, (port) => this.handleSerialConnect(socket, port));
        socket.on(REQUEST.SERIAL_DISCONNECT, () => this.handleSerialDisconnect(socket));
        socket.on(REQUEST.CONFIG, (data) => this.handleConfig(socket, JSON.parse(data)));
        socket.on(REQUEST.START_SCAN, () => this.handleStartScan());
        socket.on(REQUEST.PAUSE_SCAN, () => this.handlePauseScan());
        socket.on(REQUEST.STOP_SCAN, () => this.handleStopScan());
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
                socket.emit(RESPONSE.SERIAL_CONNECT_ERROR, {error: err.message, port: port});
            } else {
                this.serial.connected = true;
                socket.emit(RESPONSE.SERIAL_CONNECT_SUCCESS);
            }
        });
    }

    handleSerialDisconnect(socket) {
        this.serialPort.close((err) => {
            if (err) {
                socket.emit(RESPONSE.SERIAL_DISCONNECT_ERROR, err.message);
            } else {
                this.serial.connected = false;
                socket.emit(RESPONSE.SERIAL_DISCONNECT_SUCCESS);
            }
        });
    }

    handleConfig(socket, data) {
        const component = data.component;
        let arComponent = null;
        switch (component) {
            case REQUEST.AXIS_MOTOR:
                arComponent = ARDUINO_REQUEST.AR_AXIS_MOTOR;
                break;
            case REQUEST.TURNTABLE_MOTOR:
                arComponent = ARDUINO_REQUEST.AR_TURNTABLE_MOTOR;
                break;
            default:
                break;
        }
        if (arComponent) {
            const command = JSON.stringify({
                    command: ARDUINO_REQUEST.AR_CONFIG,
                    component: arComponent,
                    stepSize: parseInt(data.stepSize)
                }
            );
            this.logger(`[SERIAL OUT] ${command}`);
            this.serialPort.write(command);
        } else {
            socket.emit(RESPONSE.CONFIG_ERROR);
        }
    }

    handleStartScan() {
        const command = JSON.stringify({command: ARDUINO_REQUEST.AR_START_SCAN});
        this.serialPort.write(command);
    }

    handlePauseScan() {
        const command = JSON.stringify({command: ARDUINO_REQUEST.AR_PAUSE_SCAN});
        this.serialPort.write(command);
    }

    handleStopScan() {
        const command = JSON.stringify({command: ARDUINO_REQUEST.AR_STOP_SCAN});
        this.serialPort.write(command);
    }
}

module.exports = CommunicationController;