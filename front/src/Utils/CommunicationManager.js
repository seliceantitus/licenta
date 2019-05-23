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
        this.socket.component.on(SOCKET_EVENTS.SOCKET_CONNECT, () => this.socket.connected = true);
        this.socket.component.on(SOCKET_EVENTS.SOCKET_DISCONNECT, () => this.socket.connected = false);
        this.socket.component.on(SOCKET_EVENTS.SERIAL_CONNECT, () => this.serial.connected = true);
        this.socket.component.on(SOCKET_EVENTS.SERIAL_DISCONNECT, () => this.serial.connected = false);
    }

    getSocket() {
        return this.socket.component;
    }

    addSocketConnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SOCKET_CONNECT, func);
    }

    removeSocketConnectHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SOCKET_CONNECT, func);
    }

    addSocketConnectingHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SOCKET_CONNECTING, func);
    }

    removeSocketConnectingHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SOCKET_CONNECTING, func);
    }

    addSocketReconnectingHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SOCKET_RECONNECTING, (attempt) => func(attempt));
    }

    removeSocketReconnectingHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SOCKET_RECONNECTING, (attempt) => func(attempt));
    }

    addSocketReconnectFailedHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SOCKET_RECONNECT_FAILED, func);
    }

    removeSocketReconnectFailedHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SOCKET_RECONNECT_FAILED, func);
    }

    addSocketDisconnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SOCKET_DISCONNECT, func);
    }

    removeSocketDisconnectHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SOCKET_DISCONNECT, func);
    }

    addSerialConnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_CONNECT, func);
    }

    removeSerialConnectHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SERIAL_CONNECT, func);
    }

    addSerialConnectErrorHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, (error) => func(error));
    }

    removeSerialConnectErrorHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SERIAL_CONNECT_ERROR, (error) => func(error));
    }

    addSerialDisconnectHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_DISCONNECT, func)
    }

    removeSerialDisconnectHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SERIAL_DISCONNECT, func)
    }

    addSerialDisconnectErrorHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_DISCONNECT_ERROR, (error) => func(error));
    }

    removeSerialDisconnectErrorHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SERIAL_DISCONNECT_ERROR, (error) => func(error));
    }

    addSerialPortsHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_PORTS, (serialPorts) => func(serialPorts));
    }

    removeSerialPortsHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SERIAL_PORTS, (serialPorts) => func(serialPorts));
    }

    addSerialErrorHandler(func) {
        this.socket.component.on(SOCKET_EVENTS.SERIAL_ERROR, (error) => func(error));
    }

    removeSerialErrorHandler(func) {
        this.socket.component.removeListener(SOCKET_EVENTS.SERIAL_ERROR, (error) => func(error));
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

    changeSocketStatus(status) {
        this.socket.connected = status;
    }

    changeSerialStatus(status) {
        this.serial.connected = status;
    }

    isSocketConnected() {
        return this.socket.connected;
    }

    isSerialConnected() {
        return this.serial.connected;
    }
}

export default CommunicationManager;