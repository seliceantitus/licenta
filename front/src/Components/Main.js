import React from "react";
import {withStyles} from "@material-ui/core";
import NavigationWrapper from "./Wrappers/NavigationWrapper";
import PagesWrapper from "./Wrappers/PagesWrapper";
import CommunicationManager from "../Utils/CommunicationManager";
import StepperMotor from "../Utils/StepperMotor";

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
        paddingTop: theme.spacing.unit * 3,
    },
});

class Main extends React.Component {
    constructor(props) {
        super(props);
        console.log('[MAIN] Constructed');
        this.communicationManager = new CommunicationManager();
        this.communicationManager.createSocket();
        this.stepperMotor = new StepperMotor(1.8, 4);
        this.state = {
            loaded: false,
            socket: {
                connected: false
            },
            serial: {
                connected: false
            }
        }
    }

    componentDidMount() {
        this.communicationManager.addSocketConnectHandler(
            () => this.setState({socket: {connected: true}})
        );
        this.communicationManager.addSocketDisconnectHandler(
            () => this.setState({socket: {connected: false}})
        );
        this.communicationManager.addSerialConnectHandler(
            () => this.setState({serial: {connected: true}})
        );
        this.communicationManager.addSerialDisconnectHandler(
            () => this.setState({serial: {connected: false}})
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
                        stepperMotor={this.stepperMotor}
                    />
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);