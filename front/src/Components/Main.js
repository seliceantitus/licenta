import React from "react";
import {withStyles} from "@material-ui/core";
import NavigationWrapper from "./Wrappers/NavigationWrapper";
import PagesWrapper from "./Wrappers/PagesWrapper";
import CommunicationManager from "../Utils/CommunicationManager";
import StepperMotor from "../Utils/StepperMotor";
import {BOARD_STATUS} from "../Constants/Communication";

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
        }
    }

    componentDidMount() {
        this.communicationManager.addSocketConnectHandler(
            () => this.setState({socket: {connected: true}})
        );
        this.communicationManager.addSocketDisconnectHandler(
            () => this.setState({socket: {connected: false}, serial: {connected: false}})
        );
        this.communicationManager.addSerialConnectHandler(
            () => this.setState({serial: {connected: true}})
        );
        this.communicationManager.addSerialDisconnectHandler(
            () => this.setState({serial: {connected: false}, board: {status: null}})
        );
        this.communicationManager.addBoardBusyHandler(
            () => this.setState({board: {status: BOARD_STATUS.BUSY}})
        );
        this.communicationManager.addBoardReadyHandler(
            () => this.setState({board: {status: BOARD_STATUS.READY}})
        );
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <NavigationWrapper communicationManager={this.communicationManager}/>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <PagesWrapper
                        communicationManager={this.communicationManager}
                        axisMotor={this.axisMotor}
                        tableMotor={this.tableMotor}
                        board={this.state.board}
                    />
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);