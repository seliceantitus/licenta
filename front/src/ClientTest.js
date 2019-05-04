import React from "react";
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3002');

class ClientTest extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            data: 0
        };

        this.renderSensorData = this.renderSensorData.bind(this);
    }

    componentDidMount() {
        socket.on('broadcast', (json) => {
            this.setState({data: json.data.distance});
        })
    }

    renderSensorData() {

    }

    render() {
        return (
            <div>
                {this.state.data}
            </div>
        );
    }
}

export default ClientTest;