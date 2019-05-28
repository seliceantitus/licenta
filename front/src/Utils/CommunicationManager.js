import openSocket from "socket.io-client";
import {SOCKET_URL} from "../Constants/URL";
import {REQUEST, RESPONSE, SOCKET_EVENTS} from "../Constants/Communication";

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
        this.socket.component.on(SOCKET_EVENTS.SOCKET_DISCONNECT, () => {
            this.socket.connected = false;
            this.serial.connected = false
        });
        this.socket.component.on(RESPONSE.SERIAL_CONNECT_SUCCESS, () => this.serial.connected = true);
        this.socket.component.on(RESPONSE.SERIAL_DISCONNECT_SUCCESS, () => this.serial.connected = false);
    }

    getSocket() {
        return this.socket.component;
    }

    /*
    ----------[ SOCKET ]----------
     */

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

    /*
    ----------[ SERIAL ]----------
     */

    addSerialConnectHandler(func) {
        this.socket.component.on(RESPONSE.SERIAL_CONNECT_SUCCESS, func);
    }

    removeSerialConnectHandler(func) {
        this.socket.component.removeListener(RESPONSE.SERIAL_CONNECT_SUCCESS, func);
    }

    addSerialConnectErrorHandler(func) {
        this.socket.component.on(RESPONSE.SERIAL_CONNECT_ERROR, (error) => func(error));
    }

    removeSerialConnectErrorHandler(func) {
        this.socket.component.removeListener(RESPONSE.SERIAL_CONNECT_ERROR, (error) => func(error));
    }

    addSerialDisconnectHandler(func) {
        this.socket.component.on(RESPONSE.SERIAL_DISCONNECT_SUCCESS, func)
    }

    removeSerialDisconnectHandler(func) {
        this.socket.component.removeListener(RESPONSE.SERIAL_DISCONNECT_SUCCESS, func)
    }

    addSerialDisconnectErrorHandler(func) {
        this.socket.component.on(RESPONSE.SERIAL_DISCONNECT_ERROR, (error) => func(error));
    }

    removeSerialDisconnectErrorHandler(func) {
        this.socket.component.removeListener(RESPONSE.SERIAL_DISCONNECT_ERROR, (error) => func(error));
    }

    addSerialPortsHandler(func) {
        this.socket.component.on(RESPONSE.SERIAL_PORTS, (serialPorts) => func(serialPorts));
    }

    removeSerialPortsHandler(func) {
        this.socket.component.removeListener(RESPONSE.SERIAL_PORTS, (serialPorts) => func(serialPorts));
    }

    addSerialErrorHandler(func) {
        this.socket.component.on(RESPONSE.SERIAL_ERROR, (error) => func(error));
    }

    removeSerialErrorHandler(func) {
        this.socket.component.removeListener(RESPONSE.SERIAL_ERROR, (error) => func(error));
    }

    /*
    ----------[ BOARD ]----------
     */

    addBoardBusyHandler(func) {
        this.socket.component.on(RESPONSE.BOARD_BUSY, func);
    }

    removeBoardBusyHandler(func) {
        this.socket.component.removeListener(RESPONSE.BOARD_BUSY, func);
    }

    addBoardReadyHandler(func) {
        this.socket.component.on(RESPONSE.BOARD_READY, func);
    }

    removeBoardReadyHandler(func) {
        this.socket.component.removeListener(RESPONSE.BOARD_READY, func);
    }

    addConfigSuccessHandler(func) {
        this.socket.component.on(RESPONSE.CONFIG_SUCCESS, (data) => func(data));
    }

    removeConfigSuccessHandler() {
        this.socket.component.removeAllListeners(RESPONSE.CONFIG_SUCCESS);
    }

    addConfigErrorHandler(func) {
        this.socket.component.on(RESPONSE.CONFIG_ERROR, (data) => func(data));
    }

    removeConfigErrorHandler() {
        this.socket.component.removeAllListeners(RESPONSE.CONFIG_ERROR);
    }

    openSocket() {
        this.socket.component.open();
    }

    closeSocket() {
        this.socket.component.close();
    }

    openSerial(port) {
        this.socket.component.emit(REQUEST.SERIAL_CONNECT, port);
    }

    closeSerial() {
        this.socket.component.emit(REQUEST.SERIAL_DISCONNECT);
    }

    isSocketConnected() {
        return this.socket.connected;
    }

    isSerialConnected() {
        return this.serial.connected;
    }
}

export default CommunicationManager;