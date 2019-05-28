import React from "react";
import PropTypes from 'prop-types';
import {Slide, toast, ToastContainer} from 'react-toastify';
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_ERROR, TOAST_SUCCESS} from "../../Constants/UI";
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
import {COMPONENTS, REQUEST} from "../../Constants/Communication";
import {
    CONFIG_AXIS_SUCCESS,
    CONFIG_ERROR,
    CONFIG_NO_RESPONSE,
    CONFIG_TURNTABLE_SUCCESS
} from "../../Constants/Messages";

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
        const {communicationManager, axisMotor, tableMotor} = this.props;
        this.axisMotor = axisMotor;
        this.tableMotor = tableMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            enabled: false,
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

        this.showToast = (type, message) => {
            toast(message, {type: type, containerId: 'Dashboard'})
        };
    }

    componentDidMount() {
        const enabled = this.communicationManager.isSocketConnected() && this.communicationManager.isSerialConnected();
        this.setState({
            enabled: enabled,
            axisMotor: {
                stepDegree: this.axisMotor.getStepDegree(),
                stepSize: this.axisMotor.getStepIncrement(),
            },
            tableMotor: {
                stepDegree: this.tableMotor.getStepDegree(),
                stepSize: this.tableMotor.getStepIncrement(),
            }
        });
        if (this.props.board.status === 'READY') {
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
                    Text text bla bla
                </Typography>
            </div>
            <div>
                <form style={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        disabled={!this.state.enabled}
                        className={classes.textField}
                        label="Step increment"
                        value={this.state.axisMotor.stepSize}
                        onChange={this.handleConfigDataChanged('axisMotor')}
                    />
                    <Button
                        disabled={!this.state.enabled}
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
                    Text text bla bla
                </Typography>
            </div>
            <div>
                <form style={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        disabled={!this.state.enabled}
                        className={classes.textField}
                        label="Step increment"
                        value={this.state.tableMotor.stepSize}
                        onChange={this.handleConfigDataChanged('tableMotor')}
                    />
                    <Button
                        component={'button'}
                        disabled={!this.state.enabled}
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
                    <Typography variant={"subtitle2"}>
                        Information about the Infrared Sensor
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    render() {
        const {classes, board} = this.props;
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2}>
                <ToastContainer
                    enableMultiContainer
                    autoClose={3000}
                    pauseOnHover={false}
                    transition={Slide}
                    pauseOnFocusLoss={false}
                    containerId={'Dashboard'}
                />
                <Grid container item justify={"flex-start"} alignItems={"flex-start"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                      className={classes.pageHeader}
                >
                    <MuiThemeProvider theme={avatarTheme}>
                        <Avatar aria-label="Arduino Mega"
                                src={require('../../assets/img/png/ArduinoMega.png')}
                                className={classes.avatar}
                        />
                    </MuiThemeProvider>
                    <Typography variant={"h3"} className={classes.header}>Dashboard</Typography>
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
