module.exports = {
    SOCKET_EVENTS: {
        DISCONNECT: 'disconnect',
    },
    REQUEST: {
        SERIAL_CONNECT: 'serial_connect',
        SERIAL_DISCONNECT: 'serial_disconnect',
        CONFIG: 'config',
        START_SCAN: 'start_scan',
        PAUSE_SCAN: 'pause_scan',
        STOP_SCAN: 'stop_scan',
    },
    RESPONSE: {
        SERIAL_CONNECT_SUCCESS: 'serial_connect_success',
        SERIAL_CONNECT_ERROR: 'serial_connect_error',
        SERIAL_DISCONNECT_SUCCESS: 'serial_disconnect_success',
        SERIAL_DISCONNECT_ERROR: 'serial_disconnect_error',
        SERIAL_PORTS: 'serial_ports',
        SERIAL_ERROR: 'serial_error',
        BOARD_READY: 'board_ready',
        BOARD_BUSY: 'board_busy',
        START_SCAN: 'start_scan',
        PAUSE_SCAN: 'pause_scan',
        STOP_SCAN: 'stop_scan',
        FINISHED_SCAN: 'finished_scan',
        CONFIG_SUCCESS: 'config_success',
        CONFIG_ERROR: 'config_error',
        ERROR: 'error',
        MOTOR: 'motor',
        SENSOR: 'sensor',
    },
    COMPONENTS: {
        AXIS_MOTOR: 'axis_motor',
        TURNTABLE_MOTOR: 'turntable_motor',
    },
    ARDUINO_COMPONENTS: {
        AR_AXIS_MOTOR: 0x01,
        AR_TURNTABLE_MOTOR: 0x02,
    },
    ARDUINO_REQUEST: {
        AR_CONFIG: 0x00,
        AR_START_SCAN: 0x01,
        AR_PAUSE_SCAN: 0x02,
        AR_STOP_SCAN: 0x03,
        AR_MOTOR: 0x04,
        AR_SENSOR: 0x05,
        AR_RESET: 0x06,
    },
    ARDUINO_RESPONSE: {
        AR_CONFIG: 0x00,
        AR_START_SCAN: 0x01,
        AR_PAUSE_SCAN: 0x02,
        AR_STOP_SCAN: 0x03,
        AR_FINISHED_SCAN: 0x04,
        AR_ERROR: 0x05,
        AR_MOTOR: 0x06,
        AR_SENSOR: 0x07,
        AR_BOARD_READY: 0x08,
        AR_BOARD_BUSY: 0x09,
    },
    ARDUINO_ERRORS: {
        IncompleteInput: {
            ID: 'IncompleteInput',
            MESSAGE: 'Incomplete Input: It might have ended prematurely, or it was empty.',
        },
        InvalidInput: {
            ID: 'InvalidInput',
            MESSAGE: 'Invalid Input: Not a valid JSON document.',
        },
        NoMemory: {
            ID: 'NoMemory',
            MESSAGE: 'No Memory: The JsonDocument is too small.',
        },
        NotSupported: {
            ID: 'NotSupported',
            MESSAGE: 'Not Supported: It contains features that are not supported by the library.',
        },
        TooDeep: {
            ID: 'TooDeep',
            MESSAGE: 'Too many nest levels',
        },
    }
};