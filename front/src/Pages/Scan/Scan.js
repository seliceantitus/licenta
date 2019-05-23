import React from "react";
import PropTypes from 'prop-types';
import parse from "../../Parser/Parser";
import Chart from 'react-apexcharts';
import {Button, Grid, Paper, withStyles} from "@material-ui/core";
import {Block, PlayArrow} from "@material-ui/icons";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH} from "../../Constants/UI";
import {SOCKET_EVENTS} from "../../Constants/Communication";

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    paper: {
        elevation: 2,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4,
    },
    button: {
        margin: theme.spacing.unit,
    },
    buttonRightIcon: {
        marginLeft: theme.spacing.unit,
    },
    //Table style
    table: {
        fontFamily: theme.typography.fontFamily,
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
});

class Scan extends React.Component {
    constructor(props) {
        super(props);

        console.log('[SCAN] Constructed');
        const {communicationManager, stepperMotor} = this.props;
        this.stepperMotor = stepperMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            enabled: false,
            stepsLimit: 0,
            counter: 0,
            options: {
                labels: 0,
            },
            series: [{
                name: 'Distance',
                data: new Array(this.stepperMotor.getRadarLabels().length).fill(0)
            }]
        };

        this.handleInboundData = this.handleInboundData.bind(this);
        this.startScan = this.startScan.bind(this);
        this.stopScan = this.stopScan.bind(this);
    }

    componentDidMount() {
        this.socket.on(SOCKET_EVENTS.START_SCAN, (data) => console.log(data));
        this.socket.on(SOCKET_EVENTS.PAUSE_SCAN, (data) => console.log(data));
        this.socket.on(SOCKET_EVENTS.STOP_SCAN, (data) => console.log(data));
        this.setState({
            stepsLimit: this.stepperMotor.getRadarLabels().length,
            options: {
                labels: this.stepperMotor.getRadarLabels(),
            },
        });
    }

    componentWillUnmount() {
        console.log('[SCAN] Unmount');
    }

    handleInboundData(json) {
        try {
            parse(this, json);
        } catch (parseException) {
            //TODO Stop the program on exception
            console.log("Caught", parseException);
        }
        if (json.component === 'sensor') {
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
        }
    }

    startScan() {
        this.socket.emit(SOCKET_EVENTS.START_SCAN);
    }

    pauseScan() {
        this.socket.emit(SOCKET_EVENTS.PAUSE_SCAN);
    }

    stopScan() {
        this.socket.emit(SOCKET_EVENTS.STOP_SCAN);
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid container justify="center" alignItems="flex-start" spacing={8}>
                <Grid container item spacing={8} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={3} xl={3}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Button variant={"contained"} color={"primary"} className={classes.button}
                                    onClick={this.startScan}>
                                Start
                                <PlayArrow className={classes.buttonRightIcon}/>
                            </Button>
                            <Button variant={"contained"} color={"secondary"} className={classes.button}
                                    onClick={this.stopScan}>
                                Stop
                                <Block className={classes.buttonRightIcon}/>
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item spacing={8} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={7} xl={7}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Chart
                                options={this.state.options}
                                series={this.state.series}
                                type="radar"
                                height="650"
                            />
                        </Paper>
                    </Grid>
                </Grid>

            </Grid>
        );
    }
}

Scan.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scan);