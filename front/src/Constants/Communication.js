export const SOCKET_EVENTS = {
    //Socket constants
    SOCKET_CONNECT: 'connect',
    SOCKET_CONNECTING: 'connecting',
    SOCKET_RECONNECTING: 'reconnecting',
    SOCKET_RECONNECT_FAILED: 'reconnect_failed',
    SOCKET_DISCONNECT: 'disconnect',
};

export const REQUEST = {
    SERIAL_CONNECT: 'serial_connect',
    SERIAL_DISCONNECT: 'serial_disconnect',

    CONFIG: 'config',
    START_SCAN: 'start_scan',
    PAUSE_SCAN: 'pause_scan',
    STOP_SCAN: 'stop_scan',

    AXIS_MOTOR: 'axis_motor',
    TURNTABLE_MOTOR: 'turntable_motor',

    ERROR: 'error',
    MOTOR: 'motor',
    PROGRAM: 'program',
    SENSOR: 'sensor',
};

export const RESPONSE = {
    SERIAL_CONNECT_SUCCESS: 'serial_connect_success',
    SERIAL_CONNECT_ERROR: 'serial_connect_error',
    SERIAL_DISCONNECT_SUCCESS: 'serial_disconnect_success',
    SERIAL_DISCONNECT_ERROR: 'serial_disconnect_error',
    SERIAL_PORTS: 'serial_ports',
    SERIAL_ERROR: 'serial_error',

    START_SCAN: 'start_scan',
    PAUSE_SCAN: 'pause_scan',
    STOP_SCAN: 'stop_scan',

    CONFIG_SUCCESS: 'config_success',
    CONFIG_ERROR: 'config_error',
};

export const MESSAGE_CONFIG = {
    CONFIG: {
        ID: 'config',
        COMPONENT: ['axisMotor', 'turntableMotor'],
        DATA: ['stepSize']
    },

    ERROR: {
        ID: 'error',
        ON: 'onComponent',
        DATA: ['code', 'message'],
    },

    MOTOR: {
        ID: 'motor',
        LOCATION: ['axis', 'turntable'],
        ACTIONS: {
            TURN: {
                ID: 'turn',
                DATA: ['steps', 'turns'],
            },
        },
    },

    PROGRAM: {
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
    },

    SENSOR: {
        ID: 'sensor',
        ACTIONS: {
            MEASUREMENT: {
                ID: 'measurement',
                DATA: ['analog', 'voltage', 'distance'],
            },
        },
    },
}
