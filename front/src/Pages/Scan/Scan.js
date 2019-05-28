import React from "react";
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {Button, CircularProgress, Grid, Paper, withStyles} from "@material-ui/core";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH} from "../../Constants/UI";
import {REQUEST, RESPONSE} from "../../Constants/Communication";
import {Pause} from "@material-ui/icons";

const styles = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    paper: {
        elevation: 2,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    button: {
        margin: theme.spacing(1),
    },
    buttonRightIcon: {
        marginLeft: theme.spacing(1),
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
        const {communicationManager, axisMotor, tableMotor} = this.props;
        this.axisMotor = axisMotor;
        this.tableMotor = tableMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            enabled: false,
            dataLoaded: false,
            stepsLimit: 0,
            counter: 0,
            running: false,
            paused: false,
            options: {
                labels: 0,
            },
            series: [{
                name: 'Distance',
                data: new Array(this.tableMotor.getRadarLabels().length).fill(0)
            }]
        };

        this.handleInboundData = this.handleInboundData.bind(this);
        this.startScan = this.startScan.bind(this);
        this.pauseScan = this.pauseScan.bind(this);
        this.stopScan = this.stopScan.bind(this);
    }

    componentDidMount() {
        const enabled = this.communicationManager.isSocketConnected() && this.communicationManager.isSerialConnected();
        this.setState({
            enabled: enabled,
            dataLoaded: true,
            stepsLimit: this.tableMotor.getRadarLabels().length,
            options: {
                labels: this.tableMotor.getRadarLabels(),
            },
        });
        if (enabled) {
            this.socket.on(RESPONSE.START_SCAN, (data) => this.handleInboundData(RESPONSE.START_SCAN, data));
            this.socket.on(RESPONSE.PAUSE_SCAN, (data) => this.handleInboundData(RESPONSE.PAUSE_SCAN, data));
            this.socket.on(RESPONSE.STOP_SCAN, (data) => this.handleInboundData(RESPONSE.STOP_SCAN, data));
            this.socket.on(RESPONSE.SENSOR, (data) => this.handleInboundData(RESPONSE.SENSOR, data));
            this.socket.on(RESPONSE.ERROR, (data) => this.handleInboundData(RESPONSE.ERROR, data));
        }
    }

    componentWillUnmount() {
        console.log('[SCAN] Unmount');
        this.socket.removeListener(RESPONSE.START_SCAN, (data) => this.handleInboundData(RESPONSE.START_SCAN, data));
        this.socket.removeListener(RESPONSE.PAUSE_SCAN, (data) => this.handleInboundData(RESPONSE.PAUSE_SCAN, data));
        this.socket.removeListener(RESPONSE.STOP_SCAN, (data) => this.handleInboundData(RESPONSE.STOP_SCAN, data));
        this.socket.removeListener(RESPONSE.SENSOR, (data) => this.handleInboundData(RESPONSE.SENSOR, data));
        this.socket.removeListener(RESPONSE.ERROR, (data) => this.handleInboundData(RESPONSE.ERROR, data));
    }

    handleInboundData(event, json) {
        console.log(json);
        switch (event) {
            case RESPONSE.START_SCAN:
                this.setState({running: true, paused: false});
                break;
            case RESPONSE.PAUSE_SCAN:
                this.setState({paused: true});
                break;
            case RESPONSE.STOP_SCAN:
                this.setState({running: false, paused: false});
                break;
            case RESPONSE.SENSOR:
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
                });
                break;
            case RESPONSE.ERROR:
                //TODO alert the user | toast | whatever
                console.log('ERROR');
                break;
            default:
                return;
        }
    }

    startScan() {
        this.socket.emit(REQUEST.START_SCAN);
    }

    pauseScan() {
        this.socket.emit(REQUEST.PAUSE_SCAN);
    }

    stopScan() {
        this.socket.emit(REQUEST.STOP_SCAN);
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid container justify="center" alignItems="flex-start" spacing={2}>
                <Grid container item spacing={2} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={3} xl={3}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                className={classes.button}
                                onClick={this.startScan}
                                disabled={!this.state.enabled || (this.state.running && !this.state.paused)}
                            >
                                Start
                            </Button>
                            <Button
                                variant={"contained"}
                                color={"secondary"}
                                className={classes.button}
                                onClick={this.stopScan}
                                disabled={!this.state.enabled || !this.state.running}
                            >
                                Stop
                            </Button>
                            <Button
                                variant={"contained"}
                                className={classes.button}
                                onClick={this.pauseScan}
                                disabled={!this.state.enabled || (!this.state.running && !this.state.paused)}
                            >
                                <Pause/>
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item spacing={2} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={7} xl={7}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            {this.state.dataLoaded ?
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="radar"
                                    height="650"
                                />
                                :
                                <CircularProgress/>
                            }
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