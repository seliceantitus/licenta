export const OPEN_PORT = "open_port";
export const CLOSE_PORT = "close_port";
export const START_PROGRAM = "start_program";
export const STOP_PROGRAM = "stop_program";

//TODO Define structure for error response
export const ERROR = {
    ID: "error",
};

export const MOTOR = {
    ID: "motor",
    LOCATION: ["axis", "turntable"],
    ACTIONS: {
        TURN: {
            ID: "turn",
            DATA: ["steps", "turns"]
        }
    }
};

export const PORT = {
    ID: "port",
    ACTIONS: {
        OPEN: {
            ID: "open",
            DATA: null
        },
        CLOSE: {
            ID: "close",
            DATA: null
        }
    }
};

export const PROGRAM = {
    ID: "program",
    ACTIONS: {
        START: {
            ID: "start",
            DATA: null
        },
        STOP: {
            ID: "stop",
            DATA: null
        }
    }
};

export const SENSOR = {
    ID: "sensor",
    ACTIONS: {
        MEASUREMENT: {
            ID: "measurement",
            DATA: ["analog", "voltage", "distance"]
        }
    }
};
