import openSocket from "socket.io-client";
import {SOCKET_URL} from "../Constants/URL";
import {SOCKET_EVENTS} from "../Constants/Communication";

class CommunicationManager {

    constructor() {
        this.socket = {
            component: null,
            connected: false,
        };

        this.serial = {
            component: null,
            connected: false
        };
    }

    createSocket() {
        this.socket.component = openSocket(SOCKET_URL, {
            'reconnection': true,
            'reconnectionDelay': 2000,
            'reconnectionDelayMax': 4000,
            'reconnectionAttempts': 2
        });
    }

    getSocket() {
        return this.socket.component;
    }

    addConnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.CONNECT, func);
    }

    addConnectingHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.CONNECTING, func);
    }

    addReconnectingHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.RECONNECTING, (attempt) => func(attempt));
    }

    addReconnectFailedHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.RECONNECT_FAILED, func);
    }

    addDisconnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.DISCONNECT, func);
    }

    addSerialConnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_CONNECT, func);
    }

    addSerialConnectErrorHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, (error) => func(error));
    }

    addSerialDisconnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_DISCONNECT, func)
    }

    addSerialDisconnectErrorHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_DISCONNECT_ERROR, (error) => func(error));
    }

    addSerialPortsHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_PORTS, (serialPorts) => func(serialPorts));
    }

    addSerialErrorHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_ERROR, (error) => func(error));
    }

    openSocket() {
        this.socket.component.open();
    }

    closeSocket() {
        this.socket.component.close();
    }

    openSerial(port) {
        this.socket.component.emit(SOCKET_EVENTS.SERIAL_CONNECT, port);
    }

    closeSerial() {
        this.socket.component.emit(SOCKET_EVENTS.SERIAL_DISCONNECT);
    }

    isSocketConnected() {
        return this.socket.connected;
    }

    isSerialConnected() {
        return this.serial.connected;
    }
}

export default CommunicationManager;