import React from "react";
import Charts from "react-apexcharts/src/react-apexcharts";

class MotorChart extends React.Component {
    createLabels = (turns, halfTurns) => {
        if (turns === 0) return [`Turn 1`];
        let labels = [];
        for (let i = 0; i < turns; i++) {
            labels.push(`Turn ${i + 1}`);
        }
        if (halfTurns !== 0) labels.push(`Turn ${labels.length + 1}`);
        return labels;
    };

    createSeries = (turns, halfTurns) => {
        let series = [];
        if (turns === 0) return [100 * halfTurns];
        if (halfTurns === 0) {
            for (let i = 0; i < turns; i++) {
                series.push(100);
            }
            return series;
        } else {
            for (let i = 0; i < turns; i++) {
                series.push(100);
            }
            series.push(100 * halfTurns);
            return series;
        }
    };

    getChartData = () => {
        const {value} = this.props;
        const turns = Math.floor(value / 200);
        const halfTurns = (value % 200) / 200;
        const labels = this.createLabels(turns);
        const series = this.createSeries(turns, halfTurns);
        return {labels: labels, series: series}
    };

    render() {
        const {labels, series} = this.getChartData();
        this.chr = {
            options: {
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            value: {
                                formatter: function (val) {
                                    return (val * 3.6) + '°';
                                },
                            }
                        }
                    },
                },
                stroke: {
                    lineCap: 'round'
                },
                labels: labels,
            },
            series: series,
        };

        return (
            <Charts
                height="300"
                type="radialBar"
                options={this.chr.options}
                series={this.chr.series}
            />
        );
    }
}

export default MotorChart;