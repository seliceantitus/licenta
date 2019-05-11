import React from "react";
import openSocket from 'socket.io-client';

import {Card, Col, Container, ListGroup, ListGroupItem, Row, Spinner} from "react-bootstrap";
import StepperMotor from "../../Utils/StepperMotor";
import Chart from "react-apexcharts";

import './Dashboard.css';

class Dashboard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.socket = openSocket('http://localhost:3002');
        const labels = new StepperMotor(1.8, 4).getRadarLabels();
        this.state = {
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

        this.sendData = this.sendData.bind(this);
    }

    componentDidMount() {
        this.socket.on('broadcast', (json) => {
            console.log(json);
            this.setState(state => {
                const seriesData = state.series[0].data;
                if (state.counter > state.stepsLimit - 1) return {state};
                seriesData[state.counter] = json.data.distance;
                return {
                    series: [{
                        ...state.series,
                        data: seriesData
                    }],
                    counter: state.counter + 1,
                    data: json.data.distance
                }
            })
        })
    }

    sendData(component, action, data) {
        let json;
        if (data)
            json = {component: component, action: action, data: data};
        else
            json = {component: component, action: action};
        this.socket.emit('client_data', JSON.stringify(json));
    }

    render() {
        return (
            <Container>
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
                            <Card.Header>
                                <h6>IR Sensor Data</h6>
                            </Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Distance: {this.state.sensorData.distance}</ListGroupItem>
                                <ListGroupItem>Analog: {this.state.sensorData.analog}</ListGroupItem>
                                <ListGroupItem>Voltage: {this.state.sensorData.voltage}</ListGroupItem>
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header>
                                <h6>Turntable motor</h6>
                            </Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Turns: {this.state.sensorData.distance}</ListGroupItem>
                                <ListGroupItem>: {this.state.sensorData.analog}</ListGroupItem>
                                <ListGroupItem>Voltage: {this.state.sensorData.voltage}</ListGroupItem>
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header>
                                <h6>Sensor axis motor</h6>
                            </Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Distance: {this.state.sensorData.distance}</ListGroupItem>
                                <ListGroupItem>Analog: {this.state.sensorData.analog}</ListGroupItem>
                                <ListGroupItem>Voltage: {this.state.sensorData.voltage}</ListGroupItem>
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
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;
