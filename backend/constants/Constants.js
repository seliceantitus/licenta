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
    SERIAL_ERROR: 'serial_error',
    //Messaging constants
    ERROR: 'error',
    MOTOR: 'motor',
    PROGRAM: 'program',
    SENSOR: 'sensor',
};