import React from "react";
import PropTypes from 'prop-types';
import {toast} from 'react-toastify';
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH} from "../../Constants/UI";
import {
    Avatar,
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
    root: {
        flexGrow: 1,
    },
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

    constructor(props, context) {
        super(props, context);

        this.socket = this.props.socket;
        this.state = {
            // //TODO Disable page elements if socket is not enabled
            // enabled: this.socket.connected,
            // connections: {
            //     socket: {
            //         connected: this.socket.connected,
            //         status: this.socket.connected ? STATUS_OK(true) : STATUS_ERROR()
            //     },
            //     serial: {
            //         connected: false,
            //         status: STATUS_ERROR()
            //     }
            // },
        };

        this.handleOutboundData = this.handleOutboundData.bind(this);
        this.showToast = this.showToast.bind(this);
    }

    componentDidMount() {

    }

    //TODO Emit messages with specific event
    handleOutboundData(json) {
        this.socket.emit('client_data', JSON.stringify(json));
    }

    showToast(type, message) {
        toast(message, {type: type});
    }

    renderMotorData = (classes) => (
        <Grid item xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={5} xl={5}>
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
        <Grid item xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={5} xl={5}>
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
        <Grid item xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}>
            <Card>
                <CardHeader
                    title={<Typography variant={"h5"}>Configuration</Typography>}
                    subheader=""
                    avatar={
                        <MuiThemeProvider theme={avatarTheme}>
                            <Avatar aria-label="Infrared Sensor"
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
                </CardContent>
            </Card>
        </Grid>
    );

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify="center" alignItems="flex-start" spacing={8}>
                    {this.renderMotorData(classes)}
                    {this.renderSensorData(classes)}
                    {this.renderConfigurePanel(classes)}
                </Grid>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
