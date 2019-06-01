import React from "react";
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {Button, CircularProgress, Grid, Paper, withStyles} from "@material-ui/core";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_ERROR, TOAST_SUCCESS} from "../../Constants/UI";
import {BOARD_STATUS, REQUEST, RESPONSE, SCAN_STATUS} from "../../Constants/Communication";
import {CloudUpload, Delete, Pause, PlayArrow, SaveOutlined, Stop} from "@material-ui/icons";
import {API} from "../../Constants/URL";
import {Slide, toast, ToastContainer} from "react-toastify";
import {SCAN_DATA_SAVED, SCANNING_PAUSE, SCANNING_START, SCANNING_STOP} from "../../Constants/Messages";
import Divider from "@material-ui/core/Divider";
import Dashboard from "../Dashboard/Dashboard";

const styles = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    paper: {
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

        const {communicationManager, axisMotor, tableMotor, toastCallback} = this.props;
        this.axisMotor = axisMotor;
        this.tableMotor = tableMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            pageEnabled: false,
            scanStatus: null,
            options: {
                labels: [],
            },
            series: [{
                name: '',
                data: [],
            }]
        };

        this.counter = 0;
        this.layerSteps = this.tableMotor.getSteps();
        this.sessionId = 0;
        this.layerCounter = 0;
        this.layers = {
            distances: [],
            points: [],
        };

        this.handleInboundData = this.handleInboundData.bind(this);
        this.handleSensorData = this.handleSensorData.bind(this);
        this.startScan = this.startScan.bind(this);
        this.pauseScan = this.pauseScan.bind(this);
        this.stopScan = this.stopScan.bind(this);
        this.uploadScan = this.uploadScan.bind(this);
        this.deleteScan = this.deleteScan.bind(this);

        // this.showToast = (type, message) => {
            // toast(message, {type: type, containerId: 'Scan'})
            // toast(message, {type: type});
        // };
        this.showToast = toastCallback;
    }

    componentDidMount() {
        const {board} = this.props;
        if (board.status === BOARD_STATUS.READY) {
            const enabled = this.communicationManager.isSocketConnected() && this.communicationManager.isSerialConnected();
            this.setState({
                pageEnabled: enabled,
                scanStatus: SCAN_STATUS.IDLE,
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

            console.log(this.counter);
            console.log(this.layerSteps);
        }
    }

    componentWillUnmount() {
        this.socket.removeAllListeners(RESPONSE.START_SCAN);
        this.socket.removeAllListeners(RESPONSE.PAUSE_SCAN);
        this.socket.removeAllListeners(RESPONSE.STOP_SCAN);
        this.socket.removeAllListeners(RESPONSE.FINISHED_SCAN);
        this.socket.removeAllListeners(RESPONSE.SENSOR);
        this.socket.removeAllListeners(RESPONSE.ERROR);
    }

    handleInboundData(event, json) {
        switch (event) {
            case RESPONSE.START_SCAN:
                this.setState({scanStatus: SCAN_STATUS.RUNNING});
                break;
            case RESPONSE.PAUSE_SCAN:
                this.setState({scanStatus: SCAN_STATUS.PAUSED});
                break;
            case RESPONSE.STOP_SCAN:
                // The data is lost because the component is reconstructed by the BOARD_BUSY flag
                this.setState({scanStatus: SCAN_STATUS.STOPPED});
                break;
            case RESPONSE.FINISHED_SCAN:
                this.setState({scanStatus: SCAN_STATUS.FINISHED});
                break;
            case RESPONSE.SENSOR:
                this.handleSensorData(json);
                break;
            case RESPONSE.ERROR:
                this.showToast(TOAST_ERROR, json);
                break;
            default:
                return;
        }
    }

    handleSensorData(json) {
        const {distance} = json.data;
        console.log(`Distance`, distance);
        let seriesData = this.state.series[0].data;
        if (this.counter > this.layerSteps - 1) {
            seriesData = seriesData.fill(0);
            this.layers.distances.push(-1);
            this.counter = 0;
        }
        this.layers.distances.push(distance);
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
                    this.sessionId = data.data._id;
                    this.socket.emit(REQUEST.START_SCAN);
                    this.showToast(TOAST_SUCCESS, SCANNING_START);
                },
                err => {
                    console.log(err)
                })
            .catch(err => console.log(err));
    }

    pauseScan() {
        this.socket.emit(REQUEST.PAUSE_SCAN);
        this.showToast(TOAST_SUCCESS, SCANNING_PAUSE);
    }

    stopScan() {
        this.socket.emit(REQUEST.STOP_SCAN);
        this.showToast(TOAST_SUCCESS, SCANNING_STOP);
    }

    uploadScan() {
        console.log("Uploading");
        this.setState({scanStatus: SCAN_STATUS.UPLOADING});
        let z = 0.0;
        let angle = 0;
        const turnAngle = this.tableMotor.getAngle();
        let turnRadians = (Math.PI / 180.00) * turnAngle;
        const distances = [];
        let startIndex = 0;
        this.layers.distances.forEach((distance, index) => {
            if (distance === -1){
                distances.push(this.layers.distances.slice(startIndex, index));
                startIndex = index + 1;
            }
        });
        distances.forEach((distanceArray) => {
            let points = [];
            distanceArray.forEach((distance) => {
                const x = Math.sin(angle) * distance;
                const y = Math.cos(angle) * distance;
                points.push({x: x, y: y, z: z});
                angle += turnRadians;
            });
            fetch(
                API.LAYER_NEW.URL,
                {
                    method: API.LAYER_NEW.METHOD,
                    body: JSON.stringify({
                        scan_id: this.sessionId,
                        points: points,
                        distances: distanceArray
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(
                    data => {
                        //TODO

                        // console.log(data);
                    },
                    err => {
                        console.log(err)
                    })
                .catch(err => console.log(err));
            z += 0.1;
            angle = 0;
            console.log(distanceArray);
            console.log(points);
        });
        this.showToast(TOAST_SUCCESS, SCAN_DATA_SAVED);
        this.setState({scanStatus: SCAN_STATUS.IDLE});
        console.log("Done uploading");

    };

    deleteScan() {
        console.log("Deleting");
        this.setState({scanStatus: SCAN_STATUS.DELETING});
        //TODO Implement DELETE API call
        console.log("Done deleting");
    };

    renderSideMenu = (classes) => (
        <Paper className={classes.paper}>
            <Button
                variant={"contained"}
                color={"primary"}
                className={classes.button}
                onClick={this.startScan}
                disabled={!this.state.pageEnabled}
            >
                <PlayArrow/>
            </Button>
            <Button
                variant={"contained"}
                className={classes.button}
                onClick={this.pauseScan}
                disabled={!this.state.pageEnabled}
            >
                <Pause/>
            </Button>
            <Button
                variant={"contained"}
                color={"secondary"}
                className={classes.button}
                onClick={this.stopScan}
                disabled={!this.state.pageEnabled}
            >
                <Stop/>
            </Button>
            <Divider/>
            <Button
                variant={"contained"}
                color={"primary"}
                className={classes.button}
                onClick={this.uploadScan}
                disabled={!this.state.pageEnabled}
            >
                {this.state.scanStatus === SCAN_STATUS.UPLOADING ?
                    <CircularProgress variant={"indeterminate"} style={{width: 24, height: 24, color: 'white'}}/>
                    :
                    <CloudUpload/>
                }
            </Button>
            <Button
                variant={"contained"}
                color={"secondary"}
                className={classes.button}
                onClick={this.deleteScan}
                disabled={!this.state.pageEnabled}
            >
                {this.state.scanStatus === SCAN_STATUS.DELETING ?
                    <CircularProgress variant={"indeterminate"} style={{width: 24, height: 24, color: 'white'}}/>
                    :
                    <Delete/>
                }

            </Button>
        </Paper>
    );

    renderChart = (classes) => (
        <Paper className={classes.paper}>
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="radar"
                height={650}
            />
        </Paper>
    );

    render() {
        const {classes} = this.props;
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                <Grid container item spacing={0} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={1} xl={1}
                >
                    <Grid item>
                        {this.renderSideMenu(classes)}
                    </Grid>
                </Grid>
                <Grid container item spacing={0} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={9} xl={9}
                >
                    <Grid item>
                        {this.renderChart(classes)}
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