import React from "react";
import Charts from "react-apexcharts/src/react-apexcharts";

class MotorChart extends React.Component {

    generateChartData = (turns, halfTurns, size) => {
        if (size < 1) {
            return {labels: [`Turn 1`], series: [halfTurns * 100]}
        } else {
            let labels = [];
            let series = [];

            for (let i = 0; i < size; i++) {
                labels.push(`Turn ${i + 1}`);
                if (i < turns) {
                    series.push(100);
                } else if (i === turns) {
                    series.push(100 * halfTurns);
                } else {
                    series.push(0);
                }
            }
            return {labels: labels, series: series};
        }
    };

    getChartData = () => {
        const {value, max} = this.props;
        const turns = Math.floor(value / 200);
        const halfTurns = (value % 200) / 200;
        const size = max / 200;
        return this.generateChartData(turns, halfTurns, size);
    };

    render() {
        const {labels, series} = this.getChartData();
        this.chr = {
            options: {
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 5
                        },
                        dataLabels: {
                            value: {
                                formatter: function (val) {
                                    return (val * 3.6) + '°';
                                },
                            },
                            total: {
                                show: true,
                                label: 'Degrees',
                                formatter: function (data) {
                                    return data.globals.seriesTotals.reduce(
                                        (a, b) => {
                                            return a + b
                                        }, 0) * 3.6 + '°';
                                }
                            }
                        }
                    },
                },
                stroke: {
                    curve: 'straight',
                    lineCap: 'butt'
                },
                labels: labels,
            },
            series: series,
        };

        return (
            <Charts
                height="250"
                width="300"
                type="radialBar"
                options={this.chr.options}
                series={this.chr.series}
            />
        );
    }
}

export default MotorChart;