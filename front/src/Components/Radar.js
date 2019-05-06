import React from 'react';
import Chart from "react-apexcharts";
import StepperMotor from '../Utils/StepperMotor';

class Radar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.socket = this.props.data.socket;
        const labels = props.data.labels;
        this.state = {
            stepsLimit: labels.length,
            options: props.data.options,
            series: props.data.series
            // options: {
            //     labels: labels,
            // },
            // series: [{
            //     name: 'Distance',
            //     data: props.data.values
            // }]
        }
    }

    componentDidMount() {
        this.socket.on('broadcast', (json) => {
            this.setState(state => {
                const seriesData = state.series[0].data;
                if (state.counter > state.stepsLimit) return {state};
                seriesData[state.counter] = json.data.distance;
                return {
                    series: [{
                        ...state.series,
                        data: seriesData
                    }],
                    counter: state.counter + 1,
                    distance: json.data.distance
                }
            })
        })
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="radar"
                height="600"
            />
        );
    }
}

export default Radar;
