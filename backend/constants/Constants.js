module.exports = {
    SOCKET_EVENTS: {
        DISCONNECT: 'disconnect',
    },
    REQUEST: {
        SERIAL_CONNECT: 'serial_connect',
        SERIAL_CONNECT_ERROR: 'serial_connect_error',
        SERIAL_DISCONNECT: 'serial_disconnect',
        SERIAL_DISCONNECT_ERROR: 'serial_disconnect_error',
        SERIAL_PORTS: 'serial_ports',
        SERIAL_ERROR: 'serial_error',
        //
        CONFIG: 'config',
        CONFIG_ERROR: 'config_error',
        START_SCAN: 'start_scan',
        PAUSE_SCAN: 'pause_scan',
        STOP_SCAN: 'stop_scan',
        //
        AXIS_MOTOR: 'axis_motor',
        TURNTABLE_MOTOR: 'turntable_motor',
        //
        ERROR: 'error',
        MOTOR: 'motor',
        PROGRAM: 'program',
        SENSOR: 'sensor',
    },
    RESPONSE: {
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

        ERROR: 'error',
        MOTOR: 'motor',
        PROGRAM: 'program',
        SENSOR: 'sensor',
    },
    ARDUINO_REQUEST: {
        AR_CONFIG: 0x00,
        AR_START_SCAN: 0x01,
        AR_PAUSE_SCAN: 0x02,
        AR_STOP_SCAN: 0x03,
        AR_ERROR: 0x04,
        AR_MOTOR: 0x05,
        AR_PROGRAM: 0x06,
        AR_SENSOR: 0x07,
        //Arduino equivalents for Components
        AR_AXIS_MOTOR: 0x10,
        AR_TURNTABLE_MOTOR: 0x11,
    },
    ARDUINO_RESPONSE: {
        AR_CONFIG: 0x00,
        AR_START_SCAN: 0x01,
        AR_PAUSE_SCAN: 0x02,
        AR_STOP_SCAN: 0x03,
        AR_ERROR: 0x04,
        AR_MOTOR: 0x05,
        AR_PROGRAM: 0x06,
        AR_SENSOR: 0x07,
        //Arduino equivalents for Components
        AR_AXIS_MOTOR: 0x10,
        AR_TURNTABLE_MOTOR: 0x11,
    }
};