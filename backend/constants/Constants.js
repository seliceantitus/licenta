module.exports = SOCKET_EVENTS = {
    //Socket constants
    CONNECT: 'connect',
    CONNECTING: 'connecting',
    RECONNECTING: 'reconnecting',
    RECONNECT_FAILED: 'reconnect_failed',
    DISCONNECT: 'disconnect',
    //Serial constants
    SERIAL_CONNECT: 'serial_connect',
    SERIAL_CONNECT_ERROR: 'serial_connect_error',
    SERIAL_DISCONNECT: 'serial_disconnect',
    SERIAL_DISCONNECT_ERROR: 'serial_disconnect_error',
    SERIAL_PORTS: 'serial_ports',
    SERIAL_ERROR: 'serial_error',
    //Arduino commands
    CONFIG: 'config',
    START_SCAN: 'start_scan',
    PAUSE_SCAN: 'pause_scan',
    STOP_SCAN: 'stop_scan',
    //Arduino data
    ERROR: 'error',
    MOTOR: 'motor',
    PROGRAM: 'program',
    SENSOR: 'sensor',
    //Arduino equivalents for JS commands
    AR_CONFIG: 0x00,
    AR_START_SCAN: 0x01,
    AR_PAUSE_SCAN: 0x02,
    AR_STOP_SCAN: 0x03,
    AR_ERROR: 0x04,
    AR_MOTOR: 0x05,
    AR_PROGRAM: 0x06,
    AR_SENSOR: 0x07
};