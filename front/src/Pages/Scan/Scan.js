import React from "react";
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {Button, Grid, Paper, withStyles} from "@material-ui/core";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH} from "../../Constants/UI";
import {REQUEST, RESPONSE} from "../../Constants/Communication";
import {CloudUpload, Delete, Pause, PlayArrow, Stop} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {API} from "../../Constants/URL";

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
    chartHeight: {
        value: 650
    }
});

class Scan extends React.Component {
    constructor(props) {
        super(props);

        const {communicationManager, axisMotor, tableMotor} = this.props;
        this.axisMotor = axisMotor;
        this.tableMotor = tableMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            enabled: false,
            boardStatus: null,
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
        const {board} = this.props;
        this.setState({
            enabled: enabled,
            boardStatus: board.status,
            stepsLimit: this.tableMotor.getRadarLabels().length,
            options: {
                labels: this.tableMotor.getRadarLabels(),
            },
        });
        if (board.status === 'READY') {
            this.socket.on(RESPONSE.START_SCAN, (data) => this.handleInboundData(RESPONSE.START_SCAN, data));
            this.socket.on(RESPONSE.PAUSE_SCAN, (data) => this.handleInboundData(RESPONSE.PAUSE_SCAN, data));
            this.socket.on(RESPONSE.STOP_SCAN, (data) => this.handleInboundData(RESPONSE.STOP_SCAN, data));
            this.socket.on(RESPONSE.SENSOR, (data) => this.handleInboundData(RESPONSE.SENSOR, data));
            this.socket.on(RESPONSE.ERROR, (data) => this.handleInboundData(RESPONSE.ERROR, data));
        }
    }

    componentWillUnmount() {
        this.socket.removeListener(RESPONSE.START_SCAN, (data) => this.handleInboundData(RESPONSE.START_SCAN, data));
        this.socket.removeListener(RESPONSE.PAUSE_SCAN, (data) => this.handleInboundData(RESPONSE.PAUSE_SCAN, data));
        this.socket.removeListener(RESPONSE.STOP_SCAN, (data) => this.handleInboundData(RESPONSE.STOP_SCAN, data));
        this.socket.removeListener(RESPONSE.SENSOR, (data) => this.handleInboundData(RESPONSE.SENSOR, data));
        this.socket.removeListener(RESPONSE.ERROR, (data) => this.handleInboundData(RESPONSE.ERROR, data));
    }

    handleInboundData(event, json) {
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
                break;
            default:
                return;
        }
    }

    startScan() {
        fetch(
            API.SCAN_NEW.URL,
            {
                method: API.SCAN_NEW.METHOD
            })
            .then(response => response.json())
            .then(
                data => {
                    //TODO save scan session somewhere
                    console.log(data);
                    this.socket.emit(REQUEST.START_SCAN);
                },
                err => {
                    console.log(err)
                })
            .catch(err => console.log(err));
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
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                <Grid container item spacing={0} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={1} xl={1}
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
                                <PlayArrow/>
                            </Button>
                            <Button
                                variant={"contained"}
                                className={classes.button}
                                onClick={this.pauseScan}
                                disabled={!this.state.enabled || (!this.state.running && !this.state.paused) || this.state.paused}
                            >
                                <Pause/>
                            </Button>
                            <Button
                                variant={"contained"}
                                color={"secondary"}
                                className={classes.button}
                                onClick={this.stopScan}
                                disabled={!this.state.enabled || !this.state.running}
                            >
                                <Stop/>
                            </Button>
                            <Divider/>
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                className={classes.button}
                                // onClick={this.startScan}
                                disabled={!this.state.enabled}
                            >
                                <CloudUpload/>
                            </Button>
                            <Button
                                variant={"contained"}
                                className={classes.button}
                                // onClick={this.pauseScan}
                                disabled={!this.state.enabled}
                            >
                                <Delete/>
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item spacing={2} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={9} xl={9}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Chart
                                options={this.state.options}
                                series={this.state.series}
                                type="radar"
                                height={classes.chartHeight.value}
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