import React from "react";
import PropTypes from 'prop-types';
import {
    AXIS_OPTIONS,
    DEFAULT_MD_COL_WIDTH,
    DEFAULT_XS_COL_WIDTH,
    TABLE_OPTIONS,
    TOAST_ERROR,
    TOAST_SUCCESS
} from "../../Constants/UI";
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    createMuiTheme,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    MuiThemeProvider,
    Typography,
    withStyles
} from "@material-ui/core";

import {ExpandMore, SaveOutlined} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {BOARD_STATUS, COMPONENTS, REQUEST} from "../../Constants/Communication";
import {
    CONFIG_AXIS_SUCCESS,
    CONFIG_ERROR,
    CONFIG_NO_RESPONSE,
    CONFIG_TURNTABLE_SUCCESS
} from "../../Constants/Messages";
import DropdownMenu from "../../Components/Dashboard/DropdownMenu";

const styles = theme => ({
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    list: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.down('sm')]: {
            textDense: true
        },
        boxShadow: theme.shadows[1],
    },
    listAvatar: {
        width: 'auto',
        height: 'auto',
        backgroundColor: 'transparent'
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
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
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
    configForm: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing(1),
    },
    textField: {
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
});

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

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        const {communicationManager, axisMotor, tableMotor, toastCallback} = this.props;
        this.axisMotor = axisMotor;
        this.tableMotor = tableMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            pageEnabled: false,
            axisMotor: {
                configWaiting: false,
                stepDegree: 0,
                stepSize: 0
            },
            tableMotor: {
                configWaiting: false,
                stepDegree: 0,
                stepSize: 0
            },
        };

        // this.showToast = (type, message) => {
        //     toast(message, {type: type, containerId: 'Dashboard'})
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
                axisMotor: {
                    stepDegree: this.axisMotor.getStepDegree(),
                    stepSize: this.axisMotor.getStepIncrement(),
                },
                tableMotor: {
                    stepDegree: this.tableMotor.getStepDegree(),
                    stepSize: this.tableMotor.getStepIncrement(),
                }
            });

            this.communicationManager.addConfigErrorHandler(this.handleConfigError);
            this.communicationManager.addConfigSuccessHandler(this.handleConfigSuccess);
        }
    }

    componentWillUnmount() {
        this.communicationManager.removeConfigErrorHandler();
        this.communicationManager.removeConfigSuccessHandler();
    }

    handleConfigError = (data) => {
        this.setState({axisMotor: {...this.state.axisMotor, configWaiting: false}});
        this.showToast(TOAST_ERROR, `${CONFIG_ERROR} ${data}`);
    };

    handleConfigSuccess = (data) => {
        if (data['motor'] === COMPONENTS.AXIS_MOTOR) {
            this.setState({axisMotor: {...this.state.axisMotor, configWaiting: false}});
            this.axisMotor.setStepIncrement(this.state.axisMotor.stepSize);
            this.showToast(TOAST_SUCCESS, CONFIG_AXIS_SUCCESS);
            clearTimeout(this.axisMotorInterval);
        } else if (data['motor'] === COMPONENTS.TURNTABLE_MOTOR) {
            this.setState({tableMotor: {...this.state.tableMotor, configWaiting: false}});
            this.tableMotor.setStepIncrement(this.state.tableMotor.stepSize);
            this.showToast(TOAST_SUCCESS, CONFIG_TURNTABLE_SUCCESS);

            clearTimeout(this.turntableMotorInterval);
        }
    };

    handleConfigDataChanged = name => (event) => {
        console.log(event);
        this.setState({
            [name]: {
                ...this.state[name],
                stepSize: event.target.value,
            },
        });
    };

    saveAxisMotorConfig = () => {
        const newStepSize = this.state.axisMotor.stepSize;
        this.axisMotor.setStepIncrement(newStepSize);
        this.socket.emit(REQUEST.CONFIG, JSON.stringify({
            component: COMPONENTS.AXIS_MOTOR,
            stepSize: newStepSize
        }));
        this.setState({axisMotor: {...this.state.axisMotor, configWaiting: true}});
        this.axisMotorInterval = setTimeout(() => {
            if (this.state.axisMotor.configWaiting) {
                this.setState({axisMotor: {...this.state.axisMotor, configWaiting: false}});
                this.showToast(TOAST_ERROR, CONFIG_NO_RESPONSE);
            }
        }, 5000);
    };

    saveTurntableMotorConfig = () => {
        const newStepSize = this.state.tableMotor.stepSize;
        this.tableMotor.setStepIncrement(newStepSize);
        this.socket.emit(REQUEST.CONFIG, JSON.stringify({
            component: COMPONENTS.TURNTABLE_MOTOR,
            stepSize: newStepSize
        }));
        this.setState({tableMotor: {...this.state.tableMotor, configWaiting: true}});
        this.turntableMotorInterval = setTimeout(() => {
            if (this.state.tableMotor.configWaiting) {
                this.setState({tableMotor: {...this.state.tableMotor, configWaiting: false}});
                this.showToast(TOAST_ERROR, CONFIG_NO_RESPONSE);
            }
        }, 5000);
    };

    axisMotorConfig = (classes) => (
        <div>
            <div>
                <Typography style={{marginBottom: 16}}>
                    This motor is responsible for spinning the threaded axis on which the Infrared Proximity Sensor is
                    coupled.
                </Typography>
                <Typography>
                    The step increment parameter influences the total number of layers the final scan will have.
                </Typography>
            </div>
            <div>
                <form style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
                    <DropdownMenu
                        id={'axisMotor'}
                        disabled={!this.state.pageEnabled}
                        initialValue={this.state.axisMotor.stepSize}
                        options={AXIS_OPTIONS}
                        changeHandler={this.handleConfigDataChanged}
                    />
                    <Button
                        disabled={!this.state.pageEnabled}
                        variant={"contained"}
                        color={"primary"}
                        className={classes.button}
                        onClick={this.saveAxisMotorConfig}
                    >
                        {this.state.axisMotor.configWaiting ?
                            <CircularProgress variant={"indeterminate"}
                                              style={{width: 24, height: 24, color: 'white'}}/>
                            :
                            <SaveOutlined/>
                        }
                    </Button>

                </form>
            </div>
        </div>
    );

    turntableMotorConfig = (classes) => (
        <div>
            <div>
                <Typography style={{marginBottom: 16}}>
                    This motor is responsible for spinning the turntable on which the object to be scanned is located.
                </Typography>
                <Typography>
                    The step increment parameter influences the total number of points per layer.
                </Typography>
            </div>
            <div>
                <form style={{display: 'flex', alignItems: 'center'}}>
                    <DropdownMenu
                        id={'tableMotor'}
                        disabled={!this.state.pageEnabled}
                        initialValue={this.state.tableMotor.stepSize}
                        options={TABLE_OPTIONS}
                        changeHandler={this.handleConfigDataChanged}
                    />
                    <Button
                        component={'button'}
                        disabled={!this.state.pageEnabled}
                        variant={"contained"}
                        color={"primary"}
                        className={classes.button}
                        onClick={this.saveTurntableMotorConfig}
                    >
                        {this.state.tableMotor.configWaiting ?
                            <CircularProgress variant={"indeterminate"}
                                              style={{width: 24, height: 24, color: 'white'}}/>
                            :
                            <SaveOutlined/>
                        }
                    </Button>

                </form>
            </div>
        </div>
    );

    renderPageHeader = (classes) => (
        <>
            <MuiThemeProvider theme={avatarTheme}>
                <Avatar aria-label="Arduino Mega"
                        src={require('../../assets/img/png/ArduinoMega.png')}
                        className={classes.avatar}
                />
            </MuiThemeProvider>
            <Typography variant={"h3"} className={classes.header}>Dashboard</Typography>
        </>
    );

    renderMotorData = (classes) => (
        <Grid item>
            <Card>
                <CardHeader
                    title={<Typography variant={"h5"}>Stepper motors</Typography>}
                    subheader=""
                    avatar={
                        <MuiThemeProvider theme={avatarTheme}>
                            <Avatar aria-label="Stepper Motor"
                                    src={require('../../assets/img/png/StepperMotor.png')}
                                    className={classes.avatar}
                            />
                        </MuiThemeProvider>
                    }
                />
                <CardContent>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography className={classes.heading}>Sensor Axis</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>{this.axisMotorConfig(classes)}</ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography className={classes.heading}>Turntable</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>{this.turntableMotorConfig(classes)}</ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>
            </Card>
        </Grid>
    );

    renderSensorData = (classes) => (
        <Grid item>
            <Card>
                <CardHeader
                    title={<Typography variant={"h5"}>Infrared sensor</Typography>}
                    subheader=""
                    avatar={
                        <MuiThemeProvider theme={avatarTheme}>
                            <Avatar aria-label="Infrared Sensor"
                                    src={require('../../assets/img/png/InfraredSensor.png')}
                                    className={classes.avatar}
                            />
                        </MuiThemeProvider>
                    }
                />
                <CardContent>
                    <Typography variant={"body1"}>
                        The Infrared Proximity Sensor is responsible of measuring the distance to the object, which is
                        then used to compute the 3D space coordinates of the object.
                    </Typography>
                    <Typography>
                        Model: 2Y0A21
                    </Typography>
                    <Typography>
                        Distance unit: Centimeters
                    </Typography>
                    <Typography>
                        Measurements per query: 1000
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    render() {
        const {classes, board} = this.props;
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2}>
                <Grid container item justify={"flex-start"} alignItems={"flex-start"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                      className={classes.pageHeader}
                >
                    {this.renderPageHeader(classes)}
                </Grid>
                <Grid container item direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={5} xl={5}
                >
                    {this.renderMotorData(classes)}
                </Grid>
                <Grid container item direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={5} xl={5}
                >
                    {this.renderSensorData(classes)}
                </Grid>
            </Grid>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
