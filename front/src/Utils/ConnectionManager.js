import openSocket from "socket.io-client";
import {SOCKET_URL} from "../Constants/URL";

class ConnectionManager {

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
        this.socket.component.on('connect', func);
    }

    addReconnectingHandler(func) {
        this.socket.component.on('reconnecting', func);
    }

    addReconnectFailedHandler(func) {
        this.socket.component.on('reconnect_failed', func);
    }

    isSocketConnected() {
        return this.socket.connected;
    }

    isSerialConnected() {
        return this.serial.connected;
    }
}

export default ConnectionManager;