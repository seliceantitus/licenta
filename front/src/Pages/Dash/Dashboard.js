import React from "react";
import PropTypes from 'prop-types';
import {Slide, toast, ToastContainer} from 'react-toastify';
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_INFO} from "../../Constants/UI";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    createMuiTheme,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    MuiThemeProvider,
    Typography,
    withStyles
} from "@material-ui/core";

import {ExpandMore} from "@material-ui/icons";

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
        width: 60,
        height: 60,
        borderRadius: 0,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
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
        };

        this.handleOutboundData = this.handleOutboundData.bind(this);
        this.showToast = (type, message) => {
            toast(message, {type: type, containerId: 'Dashboard'})
        };
    }

    componentDidMount() {
        this.setState({
                enabled: this.communicationManager.isSocketConnected() && this.communicationManager.isSerialConnected()
            }
        );
    }

    componentWillMount() {
        console.log('[DASHBOARD] Unmount');
    }

    handleOutboundData(json) {
        // this.socket.emit('client_data', JSON.stringify(json));
    }

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
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography className={classes.heading}>Sensor Axis</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Details about the sensor axis motor
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography className={classes.heading}>Turntable</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Details about the turntable motor
                            </Typography>
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

    renderConfigurePanel = (classes) => (
        <Grid item>
            <Card>
                <CardHeader
                    title={<Typography variant={"h5"}>Configuration</Typography>}
                    subheader=""
                    avatar={
                        <MuiThemeProvider theme={avatarTheme}>
                            <Avatar aria-label="Arduino Mega"
                                    src={require('../../assets/img/png/ArduinoMega.png')}
                                    className={classes.avatar}
                            />
                        </MuiThemeProvider>
                    }
                />
                <CardContent>
                    <Typography>
                        Configure motor steps
                    </Typography>
                    <Typography>
                        List component port connections on arduino
                    </Typography>
                    <Button variant={"contained"} disabled={!this.state.enabled}>Test</Button>
                </CardContent>
            </Card>
        </Grid>
    );

    render() {
        const {classes} = this.props;
        //TODO Redesign page header
        return (
            <Grid container justify="center" alignItems="flex-start" spacing={8}>
                <ToastContainer
                    enableMultiContainer
                    autoClose={3000}
                    pauseOnHover={false}
                    transition={Slide}
                    pauseOnFocusLoss={false}
                    containerId={'Dashboard'}
                />
                <Grid container item spacing={8} justify={"center"} alignItems={"flex-start"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                >
                    <Typography variant={"h2"}>
                        Dashboard
                    </Typography>
                </Grid>
                <Grid container item spacing={8} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={4} xl={4}
                >
                    {this.renderMotorData(classes)}
                    {this.renderSensorData(classes)}
                </Grid>
                <Grid container item spacing={8} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={6} xl={6}
                >
                    {this.renderConfigurePanel(classes)}
                </Grid>
            </Grid>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
