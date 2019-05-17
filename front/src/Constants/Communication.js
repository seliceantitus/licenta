export const ERROR_DATA = "error";
export const MOTOR_DATA = "motor";
export const PORT_DATA = "port";
export const PROGRAM_DATA = "program";
export const SENSOR_DATA = "sensor";

export const OPEN_PORT = "open_port";
export const CLOSE_PORT = "close_port";

export const START_PROGRAM = "start_program";
export const STOP_PROGRAM = "stop_program";

export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    CONNECTING: 'connecting',
    RECONNECTING: 'reconnecting',
    RECONNECT_FAILED: 'reconnect_failed',
    DISCONNECT: 'disconnect',
};

export const ERROR = {
    ID: "error",
    DATA: ["code", "message"],
};

export const MOTOR = {
    ID: "motor",
    LOCATION: ["axis", "turntable"],
    ACTIONS: {
        TURN: {
            ID: "turn",
            DATA: ["steps", "turns"],
        },
    },
};

export const PORT = {
    ID: "port",
    ACTIONS: {
        OPEN: {
            ID: "open",
            DATA: null,
        },
        CLOSE: {
            ID: "close",
            DATA: null,
        },
    },
};

export const PROGRAM = {
    ID: "program",
    ACTIONS: {
        START: {
            ID: "start",
            DATA: null,
        },
        STOP: {
            ID: "stop",
            DATA: null,
        },
    },
};

export const SENSOR = {
    ID: "sensor",
    ACTIONS: {
        MEASUREMENT: {
            ID: "measurement",
            DATA: ["analog", "voltage", "distance"],
        },
    },
};
