import React from "react";
import {withStyles} from "@material-ui/core";
import NavigationWrapper from "./Wrappers/NavigationWrapper";
import PagesWrapper from "./Wrappers/PagesWrapper";
import CommunicationManager from "../Utils/CommunicationManager";

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
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <NavigationWrapper communicationManager={this.communicationManager}/>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <PagesWrapper communicationManager={this.communicationManager}/>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);