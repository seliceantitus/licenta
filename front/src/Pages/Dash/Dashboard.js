import React from "react";
import PropTypes from 'prop-types';
import {Slide, toast, ToastContainer} from 'react-toastify';
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_ERROR, TOAST_SUCCESS} from "../../Constants/UI";
import {
    Avatar,
    Card,
    CardContent,
    CardHeader, CircularProgress,
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
import {REQUEST, RESPONSE} from "../../Constants/Communication";

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
    configForm: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing.unit,
    },
    textField: {
        margin: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

const avatarTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiAvatar: {
            img: {
                objectFit: "scale-down"
            }
        }
    }
});

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        console.log('[DASHBOARD] Constructed');
        const {communicationManager, stepperMotor} = this.props;
        this.stepperMotor = stepperMotor;
        this.communicationManager = communicationManager;
        this.socket = this.communicationManager.getSocket();

        this.state = {
            enabled: false,
            configWaiting: false,
            axisMotor: {
                stepDegree: 0,
                stepSize: 0
            },
            turntableMotor: {
                stepDegree: 0,
                stepSize: 0
            },
        };

        this.showToast = (type, message) => {
            toast(message, {type: type, containerId: 'Dashboard'})
        };
    }

    componentDidMount() {
        this.setState({
            enabled: this.communicationManager.isSocketConnected() && this.communicationManager.isSerialConnected(),
            axisMotor: {
                stepDegree: this.stepperMotor.getStepDegree(),
                stepSize: this.stepperMotor.getStepIncrement(),
            },
            turntableMotor: {
                stepDegree: this.stepperMotor.getStepDegree(),
                stepSize: this.stepperMotor.getStepIncrement(),
            }
        });
        //TODO move this in comm mngr or detach it in componentwillunmount
        this.socket.on(RESPONSE.CONFIG_ERROR, () => {
            this.setState({configWaiting: false});
            this.showToast(TOAST_ERROR, 'Config error')
        });
        this.socket.on(RESPONSE.CONFIG_SUCCESS, () => {
            this.setState({configWaiting: false});
            this.showToast(TOAST_SUCCESS, 'Configuration saved')
        });
    }

    componentWillUnmount() {
        console.log('[DASHBOARD] Unmount');
    }

    handleConfigDataChanged = name => (event) => {
        //TODO Validate data
        this.setState({
            [name]: {
                ...this.state[name],
                stepSize: event.target.value,
            },
        });
    };

    saveAxisMotorConfig = () => {
        const newStepSize = this.state.axisMotor.stepSize;
        this.stepperMotor.setStepIncrement(newStepSize);
        this.socket.emit(REQUEST.CONFIG, JSON.stringify({
            component: REQUEST.AXIS_MOTOR,
            stepSize: newStepSize
        }));
        this.setState({configWaiting: true});
    };

    saveTurntableMotorConfig = () => {
        const newStepSize = this.state.turntableMotor.stepSize;
        this.stepperMotor.setStepIncrement(newStepSize);
        this.socket.emit(REQUEST.CONFIG, JSON.stringify({component: 'turntableMotor', stepSize: newStepSize}));
    };

    axisMotorConfig = (classes) => (
        <form>
            <div>
                <TextField
                    className={classes.textField}
                    label="Step increment"
                    value={this.state.axisMotor.stepSize}
                    onChange={this.handleConfigDataChanged('axisMotor')}
                />
            </div>
            <div>
                <Button
                    disabled={!this.state.enabled}
                    variant={"contained"}
                    color={"primary"}
                    className={classes.button}
                    onClick={this.saveAxisMotorConfig}
                >
                    {this.state.configWaiting ?
                        <CircularProgress variant={"indeterminate"} style={{width: 24, height: 24, color: 'white'}}/>
                        :
                        <SaveOutlined/>
                    }
                </Button>
            </div>
        </form>
    );

    turntableMotorConfig = (classes) => {
        return (
            <TextField
                label="Step increment"
                value={this.state.turntableMotor.stepSize}
                onChange={this.handleConfigDataChanged('turntableMotor')}
            />
        );
    };

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
                        <ExpansionPanelDetails>
                            {this.axisMotorConfig(classes)}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography className={classes.heading}>Turntable</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {this.turntableMotorConfig(classes)}
                        </ExpansionPanelDetails>
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
                    <Typography variant={"subheading"}>
                        Information about the Infrared Sensor
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    render() {
        const {classes} = this.props;
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={8}>
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
                    <Typography variant={"h3"}>Dashboard</Typography>
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
