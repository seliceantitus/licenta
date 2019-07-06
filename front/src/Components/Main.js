import React from "react";
import {withStyles} from "@material-ui/core";
import NavigationWrapper from "./Wrappers/NavigationWrapper";
import PagesWrapper from "./Wrappers/PagesWrapper";
import CommunicationManager from "../Utils/CommunicationManager";
import StepperMotor from "../Utils/StepperMotor";
import {BOARD_STATUS} from "../Constants/Communication";
import {toast} from "react-toastify";

const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        paddingTop: theme.spacing(3),
    },
});

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.communicationManager = new CommunicationManager();
        this.communicationManager.createSocket();
        this.axisMotor = new StepperMotor(1.8, 200);
        this.tableMotor = new StepperMotor(1.8, 8);
        this.state = {
            socket: {
                connected: false
            },
            serial: {
                connected: false
            },
            board: {
                status: null
            }
        };

        this.showToast = (type, message) => {
            toast(message, {type: type});
        }
    }

    componentDidMount() {
        this.communicationManager.addSocketConnectHandler(
            () => {
                this.setState({socket: {connected: true}});
                // this.axisMotor.setStepIncrement(200);
                // this.tableMotor.setStepIncrement(8);
            }
        );

        this.communicationManager.addSocketDisconnectHandler(
            () => {
                this.setState({socket: {connected: false}, serial: {connected: false}});
                this.axisMotor.setStepIncrement(200);
                this.tableMotor.setStepIncrement(8);
            }
        );

        this.communicationManager.addSerialConnectHandler(
            () => {
                this.setState({serial: {connected: true}});
                this.axisMotor.setStepIncrement(200);
                this.tableMotor.setStepIncrement(8);
            }
        );

        this.communicationManager.addSerialConnectErrorHandler(
            () => this.setState({serial: {connected: false}})
        );

        this.communicationManager.addSerialDisconnectHandler(
            () => {
                this.setState({serial: {connected: false}, board: {status: null}});
                this.axisMotor.setStepIncrement(200);
                this.tableMotor.setStepIncrement(8);
            }
        );

        this.communicationManager.addSerialDisconnectErrorHandler(
            () => this.setState({serial: {connected: false}})
        );

        this.communicationManager.addBoardBusyHandler(
            () => {
                this.setState({board: {status: BOARD_STATUS.BUSY}});
                this.axisMotor.setStepIncrement(200);
                this.tableMotor.setStepIncrement(8);
            }
        );

        this.communicationManager.addBoardReadyHandler(
            () => {
                this.setState({board: {status: BOARD_STATUS.READY}});
                this.axisMotor.setStepIncrement(200);
                this.tableMotor.setStepIncrement(8);
            }
        );
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <NavigationWrapper communicationManager={this.communicationManager} toastCallback={this.showToast}/>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <PagesWrapper
                        communicationManager={this.communicationManager}
                        axisMotor={this.axisMotor}
                        tableMotor={this.tableMotor}
                        board={this.state.board}
                        toastCallback={this.showToast}
                    />
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);