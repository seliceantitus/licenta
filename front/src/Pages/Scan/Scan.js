import React from "react";
import PropTypes from 'prop-types';
import parse from "../../Parser/Parser";
import Chart from 'react-apexcharts';
import {Button, Grid, Paper, withStyles} from "@material-ui/core";
import {Block, PlayArrow} from "@material-ui/icons";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_INFO} from "../../Constants/UI";
import {PROGRAM_START, PROGRAM_STOP} from "../../Constants/Messages";
import {START_PROGRAM, STOP_PROGRAM} from "../../Constants/Communication";
import StepperMotor from "../../Utils/StepperMotor";

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    paper: {
        elevation: 2,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4,
    },
    button: {
        margin: theme.spacing.unit,
    },
    buttonRightIcon: {
        marginLeft: theme.spacing.unit,
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
        console.log('[SCAN] Const');
        this.communicationManager = this.props.communicationManager;
        this.socket = this.communicationManager.getSocket();
        this.stepperMotor = new StepperMotor(1.8, 4);
        this.state = {
            stepsLimit: this.stepperMotor.getRadarLabels().length,
            counter: 0,
            options: {
                labels: this.stepperMotor.getRadarLabels(),
            },
            series: [{
                name: 'Distance',
                data: new Array(this.stepperMotor.getRadarLabels().length).fill(0)
            }]
        };

        this.handleInboundData = this.handleInboundData.bind(this);
        this.startProgram = this.startProgram.bind(this);
        this.stopProgram = this.stopProgram.bind(this);
        this.showToast = this.showToast.bind(this);
    }

    componentDidMount() {
        this.socket.on('broadcast', (json) => this.handleInboundData(json));
    }

    handleInboundData(json) {
        //TODO emit from backend specific messages
        try {
            parse(this, json);
        } catch (parseException) {
            //TODO Stop the program on exception
            console.log("Caught", parseException);
        }
        if (json.component === 'sensor') {
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
            })
        }
    }

    startProgram() {
        this.showToast(TOAST_INFO, PROGRAM_START);
    }

    stopProgram() {
        this.showToast(TOAST_INFO, PROGRAM_STOP);
    }

    showToast(type, message) {
        // toast(message, {type: type});
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid container justify="center" alignItems="flex-start" spacing={8}>
                <Grid container item spacing={8} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={3} xl={3}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Button variant={"contained"} color={"primary"} className={classes.button}
                                    onClick={this.startProgram}>
                                Start
                                <PlayArrow className={classes.buttonRightIcon}/>
                            </Button>
                            <Button variant={"contained"} color={"secondary"} className={classes.button}
                                    onClick={this.stopProgram}>
                                Stop
                                <Block className={classes.buttonRightIcon}/>
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item spacing={8} direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={7} xl={7}
                >
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Chart
                                options={this.state.options}
                                series={this.state.series}
                                type="radar"
                                height="650"
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