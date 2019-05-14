export const SOCKET_CONNECTION_SUCCESS = "Connected to server.";
export const SOCKET_CONNECTION_RETRY = (retryCounter) => `Retrying (${retryCounter}) to connect to server...`;
export const SOCKET_CONNECTION_FAIL = "Could not connect to server.";

export const SERIAL_CONNECTION_OPEN = "Connecting to Arduino...";
export const SERIAL_CONNECTION_SUCCESS = "Connected to Arduino.";
export const SERIAL_CONNECTION_CLOSING = "Disconnecting from Arduino...";
export const SERIAL_CONNECTION_CLOSED = "Disconnected from Arduino.";
export const SERIAL_CONNECTION_FAIL = "Unable to connect to Arduino. Make sure the board is connected!";

export const PROGRAM_START = "Starting the program.";
export const PROGRAM_STOP = "Stopping the program.";