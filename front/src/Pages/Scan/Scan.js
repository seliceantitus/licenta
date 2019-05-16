import React from "react";
import PropTypes from 'prop-types';
import parse from "../../Parser/Parser";
import {Slide, ToastContainer} from "react-toastify";
import Chart from 'react-apexcharts';
import {Button, Divider, Grid, Paper, withStyles} from "@material-ui/core";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_INFO} from "../../Constants/UI";
import {PROGRAM_START, PROGRAM_STOP} from "../../Constants/Messages";
import {START_PROGRAM, STOP_PROGRAM} from "../../Constants/Communication";
import StepperMotor from "../../Utils/StepperMotor";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    margin: {
        margin: theme.spacing.unit,
    },
    paper: {
        elevation: 2,
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 6,
        paddingRight: theme.spacing.unit * 6,
    },
    button: {
        width: '100%',
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

        this.socket = this.props.socket;
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
        if (json.component === 'sensor'){
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
        this.socket.emit(START_PROGRAM);
    }

    stopProgram() {
        this.showToast(TOAST_INFO, PROGRAM_STOP);
        this.socket.emit(STOP_PROGRAM);
    }

    showToast(type, message) {
        // toast(message, {type: type});
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <ToastContainer
                    autoClose={3000}
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable
                    transition={Slide}
                    position={'top-right'}
                    pauseOnFocusLoss={false}
                />
                <Grid container justify="center" alignItems="flex-start" spacing={8}>
                    <Grid item xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={2} xl={2}>
                        <Paper className={classes.paper}>
                            <Button variant={"contained"} color={"primary"} className={classes.button} onClick={this.startProgram}>
                                Start
                            </Button>
                            <Divider/>
                            <Button variant={"contained"} color={"secondary"} className={classes.button} onClick={this.stopProgram}>
                                Stop
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={6} xl={6}>
                        <Paper className={classes.paper}>
                            <Chart
                                options={this.state.options}
                                series={this.state.series}
                                type="radar"
                                height="650"
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={3} xl={3}>
                        <Paper className={classes.paper}>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Scan.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scan);