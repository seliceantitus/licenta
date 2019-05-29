import React from "react";
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {Button, Grid, Paper, withStyles} from "@material-ui/core";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH} from "../../Constants/UI";
import {BOARD_STATUS, REQUEST, RESPONSE, SCAN_STATUS} from "../../Constants/Communication";
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
            //SENSOR
            stepsLimit: 0,
            counter: 0,
            //SCAN
            running: false,
            paused: false,
            scanStatus: null,
            //CHART
            options: {
                labels: [],
            },
            series: [{
                name: '',
                data: [],
            }]
        };
        this.counter = 0;

        this.handleInboundData = this.handleInboundData.bind(this);
        this.handleSensorData = this.handleSensorData.bind(this);
        this.startScan = this.startScan.bind(this);
        this.pauseScan = this.pauseScan.bind(this);
        this.stopScan = this.stopScan.bind(this);
    }

    componentDidMount() {
        const {board} = this.props;
        if (board.status === BOARD_STATUS.READY) {
            const enabled = this.communicationManager.isSocketConnected() && this.communicationManager.isSerialConnected();
            this.setState({
                scanStatus: SCAN_STATUS.IDLE,
                enabled: enabled,
                stepsLimit: this.tableMotor.getRadarLabels().length,
                options: {
                    labels: this.tableMotor.getRadarLabels(),
                },
                series: [{
                    name: 'Distance',
                    data: new Array(this.tableMotor.getRadarLabels().length).fill(0),
                }]
            });
            this.socket.on(RESPONSE.START_SCAN, (data) => this.handleInboundData(RESPONSE.START_SCAN, data));
            this.socket.on(RESPONSE.PAUSE_SCAN, (data) => this.handleInboundData(RESPONSE.PAUSE_SCAN, data));
            this.socket.on(RESPONSE.STOP_SCAN, (data) => this.handleInboundData(RESPONSE.STOP_SCAN, data));
            this.socket.on(RESPONSE.FINISHED_SCAN, (data) => this.handleInboundData(RESPONSE.FINISHED_SCAN, data));
            this.socket.on(RESPONSE.SENSOR, (data) => this.handleInboundData(RESPONSE.SENSOR, data));
            this.socket.on(RESPONSE.ERROR, (data) => this.handleInboundData(RESPONSE.ERROR, data));
        }
    }

    componentWillUnmount() {
        this.socket.removeListener(RESPONSE.START_SCAN, (data) => this.handleInboundData(RESPONSE.START_SCAN, data));
        this.socket.removeListener(RESPONSE.PAUSE_SCAN, (data) => this.handleInboundData(RESPONSE.PAUSE_SCAN, data));
        this.socket.removeListener(RESPONSE.STOP_SCAN, (data) => this.handleInboundData(RESPONSE.STOP_SCAN, data));
        this.socket.removeListener(RESPONSE.FINISHED_SCAN, (data) => this.handleInboundData(RESPONSE.FINISHED_SCAN, data));
        this.socket.removeListener(RESPONSE.SENSOR, (data) => this.handleInboundData(RESPONSE.SENSOR, data));
        this.socket.removeListener(RESPONSE.ERROR, (data) => this.handleInboundData(RESPONSE.ERROR, data));
    }

    handleInboundData(event, json) {
        switch (event) {
            case RESPONSE.START_SCAN:
                this.setState({running: true, paused: false, scanStatus: SCAN_STATUS.RUNNING});
                break;
            case RESPONSE.PAUSE_SCAN:
                this.setState({paused: true, scanStatus: SCAN_STATUS.PAUSED});
                break;
            case RESPONSE.STOP_SCAN:
                this.setState({running: false, paused: false, scanStatus: SCAN_STATUS.STOPPED});
                break;
            case RESPONSE.FINISHED_SCAN:
                this.setState({running: false, paused: false, scanStatus: SCAN_STATUS.FINISHED});
                break;
            case RESPONSE.SENSOR:
                this.handleSensorData(json);
                break;
            case RESPONSE.ERROR:
                //TODO alert the user | toast | whatever
                break;
            default:
                return;
        }
    }

    handleSensorData(json) {
        const {distance} = json.data;
        let seriesData = this.state.series[0].data;
        if (this.counter > this.state.stepsLimit - 1) {
            fetch(
                API.LAYER_NEW.URL,
                {
                    method: API.LAYER_NEW.METHOD,
                    body: JSON.stringify({
                        scan_id: this.sessionId,
                        points: seriesData,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(
                    data => {
                        //TODO
                        console.log(data);
                    },
                    err => {
                        console.log(err)
                    })
                .catch(err => console.log(err));
            seriesData = seriesData.fill(0);
            this.counter = 0;
        }
        seriesData[this.counter] = distance;
        this.counter += 1;
        this.setState({series: [{...this.state.series, data: seriesData}]});
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
                    this.sessionId = data.data._id;
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
                                disabled={!this.state.enabled}
                            >
                                <PlayArrow/>
                            </Button>
                            <Button
                                variant={"contained"}
                                className={classes.button}
                                onClick={this.pauseScan}
                                disabled={!this.state.enabled}
                            >
                                <Pause/>
                            </Button>
                            <Button
                                variant={"contained"}
                                color={"secondary"}
                                className={classes.button}
                                onClick={this.stopScan}
                                disabled={!this.state.enabled}
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
                                height={650}
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