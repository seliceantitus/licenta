export const SOCKET_EVENTS = {
    //Socket constants
    SOCKET_CONNECT: 'connect',
    SOCKET_CONNECTING: 'connecting',
    SOCKET_RECONNECTING: 'reconnecting',
    SOCKET_RECONNECT_FAILED: 'reconnect_failed',
    SOCKET_DISCONNECT: 'disconnect',
    //Serial constants
    SERIAL_CONNECT: 'serial_connect',
    SERIAL_CONNECT_ERROR: 'serial_connect_error',
    SERIAL_DISCONNECT: 'serial_disconnect',
    SERIAL_DISCONNECT_ERROR: 'serial_disconnect_error',
    SERIAL_PORTS: 'serial_ports',
    SERIAL_ERROR: 'serial_error',
    //Arduino program constants
    CONFIG: 'config',
    START_SCAN: 'start_scan',
    PAUSE_SCAN: 'pause_scan',
    STOP_SCAN: 'stop_scan',
    //Messaging constants
    ERROR: 'error',
    MOTOR: 'motor',
    PROGRAM: 'program',
    SENSOR: 'sensor',
};

export const ERROR = {
    ID: 'error',
    ON: 'onComponent',
    DATA: ['code', 'message'],
};

export const MOTOR = {
    ID: 'motor',
    LOCATION: ['axis', 'turntable'],
    ACTIONS: {
        TURN: {
            ID: 'turn',
            DATA: ['steps', 'turns'],
        },
    },
};

export const PROGRAM = {
    ID: 'program',
    ACTIONS: {
        START: {
            ID: 'start',
            DATA: null,
        },
        STOP: {
            ID: 'stop',
            DATA: null,
        },
    },
};

export const SENSOR = {
    ID: 'sensor',
    ACTIONS: {
        MEASUREMENT: {
            ID: 'measurement',
            DATA: ['analog', 'voltage', 'distance'],
        },
    },
};
