export const INVALID_COMPONENT_ID = "Invalid component ID provided.";
export const INVALID_COMPONENT_ACTION = "Invalid component action provided.";
export const INVALID_COMPONENT_ACTION_DATA = "Invalid component data provided.";
export const INVALID_COMPONENT_LOCATION = "Invalid component location provided.";

export const MISSING_COMPONENT_ID = "Missing component ID.";
export const MISSING_COMPONENT_ACTION = "Missing component action.";
export const MISSING_COMPONENT_ACTION_DATA = "Missing component data.";
export const MISSING_COMPONENT_LOCATION = "Missing component location.";

export const SOCKET_CONNECTION_SUCCESS = "Connected to server.";
export const SOCKET_CONNECTING = "Connecting to server...";
export const SOCKET_CONNECTION_EXISTING = "Already connected to server!";
export const SOCKET_CONNECTION_RETRY = attempts => `Retrying (${attempts}) to connect to server...`;
export const SOCKET_CONNECTION_FAIL = "Could not connect to server.";
export const SOCKET_DISCONNECT = "Disconnected from server.";
export const SOCKET_NOT_CONNECTED = "A server connection is necessary in order to open a serial connection.";

export const SERIAL_CONNECTION_OPEN = "Connected to Arduino.";
export const SERIAL_CONNECTION_OPEN_ERROR = "Unable to connect to board.";
export const SERIAL_CONNECTION_CLOSE = "Disconnected from Arduino.";
export const SERIAL_CONNECTION_CLOSE_ERROR = "Unable to disconnect from board.";
export const SERIAL_NO_PORT_SELECTED = "Select the COM port on which the Arduino is connected first.";
export const SERIAL_PORT_SELECTED = port => `Selected port ${port}.`;
export const SERIAL_CONNECTION_FAIL = "Unable to connect to Arduino.";

export const CONFIG_INVALID_INPUT = "The value must be a number!";
export const CONFIG_INVALID_RANGE = "The number must be between 1 and 200";
export const CONFIG_NO_RESPONSE = "Did not receive a response from the server. Please try again.";
export const CONFIG_ERROR = "Config error: ";
export const CONFIG_AXIS_SUCCESS = "Axis motor configuration saved.";
export const CONFIG_TURNTABLE_SUCCESS = "Axis motor configuration saved.";

export const SCANNING_START = "Starting to scan.";
export const SCANNING_PAUSE = "Pausing the scan.";
export const SCANNING_STOP = "Stopping the scan.";
export const SCANNING_FINISHED = "Scan has finished.";

export const SCAN_DATA_SAVED = "Saved scan data.";