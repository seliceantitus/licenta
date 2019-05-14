import React from "react";
import ReactJson from "react-json-view";
import {Slide, toast, ToastContainer} from 'react-toastify';
import {Card, Col, Container, Row} from "react-bootstrap";

import parse from '../../Parser/Parser';
import StepperMotor from "../../Utils/StepperMotor";
import {CLOSE_PORT, OPEN_PORT, START_PROGRAM, STOP_PROGRAM} from "../../Constants/ParserConstants";
import {STATUS_ERROR, STATUS_OK, TOAST_ERROR, TOAST_INFO, TOAST_SUCCESS, TOAST_WARN} from "../../Constants/UI";
import {
    PROGRAM_START,
    PROGRAM_STOP,
    SERIAL_CONNECTION_CLOSING,
    SERIAL_CONNECTION_OPEN,
    SOCKET_CONNECTION_FAIL,
    SOCKET_CONNECTION_RETRY,
    SOCKET_CONNECTION_SUCCESS
} from "../../Constants/Messages";
import {Divider, ListItemText, ListSubheader, List, ListItem, ListItemIcon} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {ImportExport, Usb} from "@material-ui/icons";


class Dashboard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.socket = this.props.socket;
        this.reconnectAttempts = 1;
        this.socket.on('connect', () => {
            this.showToast(TOAST_SUCCESS, SOCKET_CONNECTION_SUCCESS);
            this.setState({connections: {...this.state.connections, socket: true}});
            this.reconnectAttempts = 1;
        });

        this.socket.on('reconnecting', () => {
            this.showToast(TOAST_WARN, SOCKET_CONNECTION_RETRY(this.reconnectAttempts));
            this.setState({connections: {...this.state.connections, socket: false}});
            this.reconnectAttempts += 1;
        });

        this.socket.on('reconnect_failed', () => {
            this.showToast(TOAST_ERROR, SOCKET_CONNECTION_FAIL);
            this.setState({connections: {...this.state.connections, socket: false}});
            this.setState({enabled: false});
        });

        this.labels = new StepperMotor(1.8, 4).getRadarLabels();
        this.state = {
            enabled: this.socket.connected,
            connections: {
                socket: false,
                serial: false
            },
            sensorData: {
                distance: 0,
                analog: 0,
                voltage: 0
            },
            turntableMotorData: {
                steps: 0,
                turns: 0,
            },
            zAxisMotorData: {
                steps: 0,
                turns: 0,
            },
            rawData: [],
            counter: 0,
            stepsLimit: this.labels.length,
            options: {
                labels: this.labels,
            },
            series: [{
                name: 'Distance',
                data: new Array(this.labels.length).fill(0)
            }],
            test: undefined
        };

        this.handleOutboundData = this.handleOutboundData.bind(this);
        this.handleInboundData = this.handleInboundData.bind(this);
        this.toggleSerialPort = this.toggleSerialPort.bind(this);
        this.startProgram = this.startProgram.bind(this);
        this.stopProgram = this.stopProgram.bind(this);
        this.showToast = this.showToast.bind(this);
        this.showConnectionsStatus = this.showConnectionsStatus.bind(this);
    }

    componentDidMount() {
        this.socket.on('broadcast', (json) => this.handleInboundData(json));
    }

    handleInboundData(json) {
        try {
            parse(this, json);
        } catch (parseException) {
            //TODO Stop the program
            console.log("Caught", parseException);
        }

        if (json.component === "sensor") {
            this.setState(state => {
                const seriesData = state.series[0].data;
                if (state.counter > state.stepsLimit - 1) return {state};
                seriesData[state.counter] = json.data.distance;
                return {
                    rawData: [...state.rawData, json],
                    series: [{
                        ...state.series,
                        data: seriesData
                    }],
                    counter: state.counter + 1,
                    data: json.data.distance
                }
            })
        }
    }

    handleOutboundData(json) {
        this.socket.emit('client_data', JSON.stringify(json));
    }

    toggleSerialPort() {
        if (!this.state.connections.serial) {
            this.showToast(TOAST_INFO, SERIAL_CONNECTION_OPEN);
            this.socket.emit(OPEN_PORT);
            this.setState({connections: {...this.state.connections, serial: true}});
        } else {
            this.showToast(TOAST_INFO, SERIAL_CONNECTION_CLOSING);
            this.socket.emit(CLOSE_PORT);
            this.setState({connections: {...this.state.connections, serial: false}});
        }
    }

    startProgram() {
        this.showToast(TOAST_INFO, PROGRAM_START);
        this.socket.emit(START_PROGRAM);
    }

    stopProgram() {
        this.showToast(TOAST_INFO, PROGRAM_STOP);
        this.socket.emit(STOP_PROGRAM);
    }

    showToast(type, message) {
        toast(message, {type: type});
    }

    showConnectionsStatus() {
        if (this.state.connections.socket) {
            return STATUS_OK();
        } else {
            return STATUS_ERROR();
        }
    }

    render() {
        return (
            <Container>
                <ToastContainer
                    autoClose={2000}
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable
                    transition={Slide}
                    position={'top-right'}
                    pauseOnFocusLoss={false}
                />
                <Row>
                    <Col xs={12}>


                    </Col>
                    <Col xs={2}>
                        <Paper elevation={2}>
                            {/*<h3>Components</h3>*/}
                            <List component="nav">
                                <ListSubheader component="div">
                                    Connection status
                                </ListSubheader>
                                <Tooltip
                                    title={this.state.connections.socket ? "Click to disconnect" : "Click to connect"}
                                    placement="left"
                                >
                                    <ListItem button>
                                        <ListItemAvatar>
                                            <ImportExport color={'action'}/>
                                        </ListItemAvatar>
                                        <ListItemText>
                                            Socket
                                        </ListItemText>
                                        <ListItemIcon>
                                            {this.state.connections.socket ? STATUS_OK() : STATUS_ERROR()}
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                                <Divider/>
                                <Tooltip
                                    title={this.state.connections.serial ? "Click to disconnect" : "Click to connect"}
                                    placement="left"
                                >
                                    <ListItem button onClick={this.toggleSerialPort}>
                                        <ListItemAvatar>
                                            <Usb color={'action'}/>
                                        </ListItemAvatar>
                                        <ListItemText>
                                            Serial
                                        </ListItemText>
                                        <ListItemIcon>
                                            {this.state.connections.serial ? STATUS_OK(true) : STATUS_ERROR()}
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                            </List>
                        </Paper>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Card>
                            <Card.Header>
                                <h5>Serial communication log</h5>
                            </Card.Header>
                            <Card.Body className={'logger'}>
                                {this.state.rawData.map((json, index) =>
                                    <ReactJson
                                        key={'json-log-' + index}
                                        src={json}
                                        name={json.component}
                                        collapsed={true}
                                        enableClipboard={false}
                                        displayObjectSize={false}
                                        displayDataTypes={false}
                                    />
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;
