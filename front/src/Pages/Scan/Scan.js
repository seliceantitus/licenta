import React from "react";
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {
    Avatar,
    Button,
    CircularProgress,
    createMuiTheme,
    Divider,
    Grid,
    MuiThemeProvider,
    Paper,
    Typography,
    withStyles
} from "@material-ui/core";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_ERROR, TOAST_SUCCESS} from "../../Constants/UI";
import {BOARD_STATUS, REQUEST, RESPONSE, SCAN_STATUS} from "../../Constants/Communication";
import {CloudUpload, Delete, Pause, PlayArrow, Stop} from "@material-ui/icons";
import {API} from "../../Constants/URL";
import {
    SCAN_ACTIVE_WARNING,
    SCAN_DATA_DELETED,
    SCAN_DATA_SAVED,
    SCAN_STOP_DIALOG_BODY,
    SCAN_STOP_DIALOG_TITLE,
    SCAN_UPLOAD_DIALOG_BODY,
    SCAN_UPLOAD_DIALOG_TITLE,
    SCANNING_FINISHED,
    SCANNING_PAUSE,
    SCANNING_START,
    SCANNING_STOP
} from "../../Constants/Messages";
import AgreeDialog from "../../Components/Scan/AgreeDialog";
import InputDialog from "../../Components/Scan/InputDialog";
import Snackbar from "@material-ui/core/Snackbar";

const avatarTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiAvatar: {
            img: {
                objectFit: "scale-down",
            }
        }
    }
});

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
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 0,
        [theme.breakpoints.down('sm')]: {
            width: 64,
            height: 64,
        },
    },
    pageHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    header: {
        fontWeight: 200,
        fontSize: '3.6rem',
        marginLeft: '2rem',
        textTransform: 'uppercase',
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
            startDialogOpen: false,
            stopDialogOpen: false,
            deleteDialogOpen: false,
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

    resetVariables = () => {
        this.counter = 0;
        this.sessionId = 0;
        this.layerCounter = 0;
        this.layers.distances = [];
        this.layers.points = [];
    };

    handleInboundData(event, json) {
        switch (event) {
            case RESPONSE.START_SCAN:
                this.setState({scanStatus: SCAN_STATUS.RUNNING});
                break;
            case RESPONSE.PAUSE_SCAN:
                this.setState({scanStatus: SCAN_STATUS.PAUSED});
                this.showToast(TOAST_SUCCESS, SCANNING_PAUSE);
                break;
            case RESPONSE.STOP_SCAN:
                //TODO The data is lost because the component is reconstructed by the BOARD_BUSY flag
                // prompt the user with a warning message before - Dialog

                this.resetVariables();
                this.setState({
                        scanStatus: SCAN_STATUS.STOPPED,
                        stopDialogOpen: false,
                        options: {
                            labels: this.tableMotor.getRadarLabels(),
                        },
                        series: [{
                            name: 'Distance',
                            data: new Array(this.tableMotor.getSteps()).fill(0),
                        }]
                    }
                );
                this.showToast(TOAST_SUCCESS, SCANNING_STOP);
                break;
            case RESPONSE.FINISHED_SCAN:
                this.showToast(TOAST_SUCCESS, SCANNING_FINISHED);
                this.setState({
                    scanStatus: SCAN_STATUS.FINISHED,
                    series: [{
                        name: 'Distance',
                        data: new Array(this.tableMotor.getRadarLabels().length).fill(0),
                    }]
                });
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
        console.log(distance);
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

    startScan(scanName) {
        let name = scanName ? scanName : 'Unnamed';
        let body = {name: name};
        fetch(
            API.SCAN_NEW.URL,
            {
                method: API.SCAN_NEW.METHOD,
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(
                data => {
                    this.setState({startDialogOpen: false});
                    this.sessionId = data.data._id;
                    this.socket.emit(REQUEST.START_SCAN);
                    this.showToast(TOAST_SUCCESS, SCANNING_START);
                    console.log(this.sessionId);
                },
                err => {
                    console.log(err)
                })
            .catch(err => this.showToast(TOAST_ERROR, err));
    }

    pauseScan() {
        if (this.state.scanStatus !== SCAN_STATUS.PAUSED) {
            this.socket.emit(REQUEST.PAUSE_SCAN);
        } else {
            //TODO create handler for unpause
        }
    }

    stopScan() {
        this.socket.emit(REQUEST.STOP_SCAN);
    }

    uploadScan() {
        this.setState({scanStatus: SCAN_STATUS.UPLOADING});
        let z = 0.0;
        let angle = 0;
        const turnAngle = this.tableMotor.getAngle();
        let turnRadians = (Math.PI / 180.00) * turnAngle;
        const distances = [];
        let startIndex = 0;
        console.log('Splitting original array', this.layers.distances);
        this.layers.distances.forEach((distance, index) => {
            if (distance === -1) {
                distances.push(this.layers.distances.slice(startIndex, index));
                startIndex = index + 1;
            }
        });
        console.log('Processing local var distances', distances);
        distances.forEach((distanceArray) => {
            let points = [];
            console.log('For each array', distanceArray);
            distanceArray.forEach((distance) => {
                const x = Math.sin(angle) * distance;
                const y = Math.cos(angle) * distance;
                points.push({x: x, y: y, z: z});
                angle += turnRadians;
                console.log('\t', angle);
            });
            console.log('Fetching');
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
                        console.log(data);
                        // this.resetVariables();
                    },
                    err => {
                        console.log(err)
                    })
                .catch(err => this.showToast(TOAST_ERROR, err));
            z += 0.1;
            angle = 0;
            console.log(distanceArray);
            console.log(points);
        });
        this.showToast(TOAST_SUCCESS, SCAN_DATA_SAVED);
        this.setState({
            scanStatus: SCAN_STATUS.IDLE,
            series: [{
                name: 'Distance',
                data: new Array(this.tableMotor.getRadarLabels().length).fill(0),
            }]
        });
    };

    deleteScan() {
        this.setState({scanStatus: SCAN_STATUS.DELETING});
        fetch(
            API.SCAN_DELETE.URL(this.sessionId),
            {
                method: API.SCAN_DELETE.METHOD,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(
                data => {
                    this.showToast(TOAST_SUCCESS, SCAN_DATA_DELETED);
                    this.setState({scanStatus: SCAN_STATUS.IDLE});
                },
                err => {
                    console.log(err);
                })
            .catch(err => this.showToast(TOAST_ERROR, err));
    };

    renderPageHeader = (classes) => (
        <>
            <MuiThemeProvider theme={avatarTheme}>
                <Avatar aria-label="Arduino Mega"
                        src={require('../../assets/img/png/ArduinoMega.png')}
                        className={classes.avatar}
                />
            </MuiThemeProvider>
            <Typography variant={"h3"} className={classes.header}>Scan</Typography>
        </>
    );

    renderSideMenu = (classes) => (
        <Paper className={classes.paper}>
            <Button
                variant={"contained"}
                color={"primary"}
                className={classes.button}
                onClick={() => this.setState({startDialogOpen: true})}
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
                onClick={() => this.setState({stopDialogOpen: true})}
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
                disabled={!this.state.pageEnabled || !(this.state.scanStatus === SCAN_STATUS.FINISHED)}
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
                disabled={!this.state.pageEnabled || !(this.state.scanStatus === SCAN_STATUS.FINISHED)}
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

    renderScanActiveAlert = () => (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={this.state.scanStatus === SCAN_STATUS.RUNNING || this.state.scanStatus === SCAN_STATUS.PAUSED}
            autoHideDuration={100000000}
            message={SCAN_ACTIVE_WARNING}
        />
    );

    render() {
        const {classes} = this.props;
        return (
            <>
                <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                    <Grid container item justify={"flex-start"} alignItems={"flex-start"}
                          xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                          className={classes.pageHeader}
                    >
                        {this.renderPageHeader(classes)}
                    </Grid>
                </Grid>
                <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                    <Grid container item spacing={0} direction={"column"} justify={"center"} alignItems={"stretch"}
                          xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={1} xl={1}
                    >
                        <Grid item>
                            {this.renderScanActiveAlert()}
                            {this.renderSideMenu(classes)}
                            <AgreeDialog
                                open={this.state.stopDialogOpen}
                                title={SCAN_STOP_DIALOG_TITLE}
                                body={SCAN_STOP_DIALOG_BODY}
                                okButtonText={'I understand'}
                                cancelButtonText={'Cancel'}
                                okHandler={this.stopScan}
                                cancelHandler={() => this.setState({stopDialogOpen: false})}
                            />
                            <InputDialog
                                open={this.state.startDialogOpen}
                                title={SCAN_UPLOAD_DIALOG_TITLE}
                                body={SCAN_UPLOAD_DIALOG_BODY}
                                okButtonText={'Save'}
                                cancelButtonText={'Don\'t use a name'}
                                okHandler={this.startScan}
                                cancelHandler={this.startScan}
                                closeHandler={() => this.setState({startDialogOpen: false})}
                            />
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
            </>
        );
    }
}

Scan.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scan);
