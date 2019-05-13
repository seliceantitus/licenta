import React from "react";
import Chart from "react-apexcharts";
import ReactJson from "react-json-view";
import {toast, ToastContainer, Zoom} from 'react-toastify';
import {Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";

import parse from '../../Parser/Parser';
import StepperMotor from "../../Utils/StepperMotor";

class Dashboard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.socket = this.props.socket;
        this.reconnectAttempts = 1;
        this.socket.on('connect', () => {
            toast.success("Established connection to backend.", {
                position: toast.POSITION.TOP_RIGHT
            });
            this.reconnectAttempts = 1;
        });

        this.socket.on('reconnecting', () => {
            toast.warn(`Attempting to reconnect [${this.reconnectAttempts}] to backend socket...`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            this.reconnectAttempts += 1;
        });

        this.socket.on('reconnect_failed', () => {
            toast.error("Could not establish connection to backend.", {
                position: toast.POSITION.TOP_RIGHT
            });
            this.setState({enabled: false});
        });

        const labels = new StepperMotor(1.8, 4).getRadarLabels();
        this.state = {
            enabled: this.socket.connected,
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
            stepsLimit: labels.length,
            options: {
                labels: labels,
            },
            series: [{
                name: 'Distance',
                data: new Array(labels.length).fill(0)
            }]
        };

        this.handleOutboundData = this.handleOutboundData.bind(this);
        this.handleInboundData = this.handleInboundData.bind(this);
    }

    componentDidMount() {
        this.socket.on('broadcast', (json) => this.handleInboundData(json));
    }

    handleInboundData(json) {
        try {
            parse(this, json);
        } catch (parseException) {
            //TODO HANDLE EXCEPTION
        }

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

    handleOutboundData(json) {
        this.socket.emit('client_data', JSON.stringify(json));
    }

    render() {
        return (
            <Container>
                <ToastContainer
                    autoClose={8000}
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable
                    transition={Zoom}
                />
                <Row>
                    <Col xs={8}>
                        <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="radar"
                            height="650"
                        />
                    </Col>
                    <Col xs={4}>
                        <Card>
                            <Card.Header style={{backgroundColor: 'rgb(67, 219, 80)'}}>
                                <h6>IR Sensor Data</h6>
                            </Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Distance: {this.state.sensorData.distance}</ListGroupItem>
                                <ListGroupItem>Analog: {this.state.sensorData.analog}</ListGroupItem>
                                <ListGroupItem>Voltage: {this.state.sensorData.voltage}</ListGroupItem>
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header style={{backgroundColor: 'rgb(67, 178, 219)'}}>
                                <h6>Turntable motor</h6>
                            </Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Steps: {this.state.turntableMotorData.steps}</ListGroupItem>
                                <ListGroupItem>Turns: {this.state.turntableMotorData.turns}</ListGroupItem>
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header style={{backgroundColor: 'rgb(247, 228, 81)'}}>
                                <h6>Sensor axis motor</h6>
                            </Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Steps: {this.state.zAxisMotorData.steps}</ListGroupItem>
                                <ListGroupItem>Turns: {this.state.zAxisMotorData.turns}</ListGroupItem>
                            </ListGroup>
                        </Card>
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
