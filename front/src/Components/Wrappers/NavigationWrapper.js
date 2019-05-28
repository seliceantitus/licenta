import React from 'react';
import NavigationFrame from "../Navigation/NavigationFrame";
import {
    STATUS_ERROR,
    STATUS_OK,
    STATUS_WARNING,
    TOAST_ERROR,
    TOAST_INFO,
    TOAST_SUCCESS,
    TOAST_WARN
} from "../../Constants/UI";
import {
    SERIAL_CONNECTION_CLOSE,
    SERIAL_CONNECTION_CLOSE_ERROR,
    SERIAL_CONNECTION_FAIL,
    SERIAL_CONNECTION_OPEN,
    SERIAL_CONNECTION_OPEN_ERROR,
    SERIAL_NO_PORT_SELECTED,
    SERIAL_PORT_SELECTED,
    SOCKET_CONNECTING,
    SOCKET_CONNECTION_EXISTING,
    SOCKET_CONNECTION_FAIL,
    SOCKET_CONNECTION_RETRY,
    SOCKET_CONNECTION_SUCCESS,
    SOCKET_DISCONNECT,
    SOCKET_NOT_CONNECTED
} from "../../Constants/Messages";
import {Slide, toast, ToastContainer} from "react-toastify/index";
import {CssBaseline,} from "@material-ui/core";
import NavigationList from "../Navigation/NavigationList";

class NavigationWrapper extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.communicationManager = this.props.communicationManager;

        this.state = {
            socket: {
                connected: false,
                status: STATUS_ERROR()
            },
            serial: {
                connected: false,
                status: STATUS_ERROR()
            },
            serialPorts: [],
            selectedSerialPort: null,
        };

        this.showToast = (type, message) => {
            toast(message, {type: type, containerId: 'NavigationWrapper'})
        };
        this.socketConnect = () => {
            this.showToast(TOAST_SUCCESS, SOCKET_CONNECTION_SUCCESS);
            this.setState({socket: {connected: true, status: STATUS_OK()}});
        };
        this.socketConnecting = () => {
            this.showToast(TOAST_INFO, SOCKET_CONNECTING);
        };
        this.socketReconnecting = (attempts) => {
            this.showToast(TOAST_WARN, SOCKET_CONNECTION_RETRY(attempts));
            this.setState({socket: {connected: false, status: STATUS_WARNING(true)}});
        };
        this.socketReconnectFailed = () => {
            this.showToast(TOAST_ERROR, SOCKET_CONNECTION_FAIL);
            this.setState({
                socket: {
                    connected: false,
                    status: STATUS_ERROR()
                },
                serial: {
                    connected: false,
                    status: STATUS_ERROR()
                },
            });
        };
        this.socketDisconnect = () => {
            this.showToast(TOAST_ERROR, SOCKET_DISCONNECT);
            this.setState({
                socket: {
                    connected: false,
                    status: STATUS_ERROR()
                },
                serial: {
                    connected: false,
                    status: STATUS_ERROR()
                },
                serialPorts: [],
            });
        };
        this.serialConnect = () => {
            this.showToast(TOAST_SUCCESS, SERIAL_CONNECTION_OPEN);
            this.setState({serial: {connected: true, status: STATUS_OK(true)}});
        };
        this.serialConnectFailed = (response) => {
            this.showToast(TOAST_ERROR, `${SERIAL_CONNECTION_OPEN_ERROR} ${response.error}`);
            this.setState(state => {
                const filteredPorts = state.serialPorts.filter(port => port !== response.port);
                return {
                    serial: {
                        connected: false,
                        status: STATUS_ERROR()
                    },
                    serialPorts: filteredPorts
                };
            });
        };
        this.serialDisconnect = () => {
            this.showToast(TOAST_SUCCESS, SERIAL_CONNECTION_CLOSE);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        };
        this.serialDisconnectFailed = (error) => {
            this.showToast(TOAST_ERROR, `${SERIAL_CONNECTION_CLOSE_ERROR} ${error}`);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        };
        this.serialPortsList = (serialPorts) => {
            this.setState({serialPorts: JSON.parse(serialPorts)});
        };
        this.serialError = (error) => {
            this.showToast(TOAST_ERROR, `${SERIAL_CONNECTION_FAIL} ${error}`);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        };
    }

    componentDidMount() {
        this.communicationManager.addSocketConnectHandler(this.socketConnect);
        this.communicationManager.addSocketConnectingHandler(this.socketConnecting);
        this.communicationManager.addSocketReconnectingHandler(this.socketReconnecting);
        this.communicationManager.addSocketReconnectFailedHandler(this.socketReconnectFailed);
        this.communicationManager.addSocketDisconnectHandler(this.socketDisconnect);
        this.communicationManager.addSerialConnectHandler(this.serialConnect);
        this.communicationManager.addSerialConnectErrorHandler(this.serialConnectFailed);
        this.communicationManager.addSerialDisconnectHandler(this.serialDisconnect);
        this.communicationManager.addSerialDisconnectErrorHandler(this.serialDisconnectFailed);
        this.communicationManager.addSerialPortsHandler(this.serialPortsList);
        this.communicationManager.addSerialErrorHandler(this.serialError);
    }

    componentWillUnmount() {
        this.communicationManager.removeSocketConnectHandler(this.socketConnect);
        this.communicationManager.removeSocketConnectingHandler(this.socketConnecting);
        this.communicationManager.removeSocketReconnectingHandler(this.socketReconnecting);
        this.communicationManager.removeSocketReconnectFailedHandler(this.socketReconnectFailed);
        this.communicationManager.removeSocketDisconnectHandler(this.socketDisconnect);
        this.communicationManager.removeSerialConnectHandler(this.serialConnect);
        this.communicationManager.removeSerialConnectErrorHandler(this.serialConnectFailed);
        this.communicationManager.removeSerialDisconnectHandler(this.serialDisconnect);
        this.communicationManager.removeSerialDisconnectErrorHandler(this.serialDisconnectFailed);
        this.communicationManager.removeSerialPortsHandler(this.serialPortsList);
        this.communicationManager.removeSerialErrorHandler(this.serialError);
    }

    handleSocketClick = () => {
        if (this.state.socket.connected) {
            this.showToast(TOAST_INFO, SOCKET_CONNECTION_EXISTING);
        } else {
            this.communicationManager.openSocket();
        }
    };

    handleSerialClick = () => {
        if (!this.state.socket.connected) {
            this.showToast(TOAST_ERROR, SOCKET_NOT_CONNECTED);
        } else if (this.state.selectedSerialPort === null) {
            this.showToast(TOAST_WARN, SERIAL_NO_PORT_SELECTED);
        } else {
            if (this.state.serial.connected) {
                this.communicationManager.closeSerial();
            } else {
                this.setState({serial: {...this.state.serial, status: STATUS_WARNING(true)}});
                this.communicationManager.openSerial(this.state.selectedSerialPort);
            }
        }
    };

    handleSerialPortsSelect = (port) => {
        if (port) {
            this.setState({selectedSerialPort: port});
            this.showToast(TOAST_SUCCESS, SERIAL_PORT_SELECTED(port));
        }
    };

    render() {
        return (
            <>
                <CssBaseline/>
                <ToastContainer
                    enableMultiContainer
                    autoClose={3000}
                    pauseOnHover={false}
                    transition={Slide}
                    pauseOnFocusLoss={false}
                    containerId={'NavigationWrapper'}
                />
                <NavigationFrame>
                    <NavigationList
                        socket={this.state.socket}
                        serial={this.state.serial}
                        serialPorts={this.state.serialPorts}
                        socketHandler={this.handleSocketClick}
                        serialHandler={this.handleSerialClick}
                        serialPortsHandler={this.handleSerialPortsSelect}
                    />
                </NavigationFrame>
            </>
        );
    }
}

export default NavigationWrapper;
