import React from "react";
import openSocket from 'socket.io-client';

import {Button, Col, Container, Row} from "react-bootstrap";
import StepperMotor from "../../Utils/StepperMotor";
import Chart from "react-apexcharts";

class Dashboard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.socket = openSocket('http://localhost:3002');
        const labels = new StepperMotor(1.8, 2).getRadarLabels();
        this.state = {
            counter: 0,
            labels: labels,
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
                if (state.counter > state.stepsLimit - 1) return{state};
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

    sendData() {
        const json = {component: 'board', action: 'start'};
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
                            height="1000"
                        />
                    </Col>
                    <Col xs={4}>
                        <Button variant={'danger'} onClick={this.sendData}>
                            Test
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant={'success'}>
                            Send
                        </Button>
                    </Col>

                </Row>
            </Container>
        );
    }
}

export default Dashboard;
