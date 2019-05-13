//Parser.js
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
        END: {
            ID: "end",
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
