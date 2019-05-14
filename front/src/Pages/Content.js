import React from 'react';
import {Route, Switch} from "react-router-dom";
import openSocket from 'socket.io-client';

import Dashboard from "./Dash/Dashboard";
import ErrorBoundary from "./Error/ErrorBoundary";
import History from "./History/History";
import Scan from "./Scan/Scan";

class Content extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.socket = openSocket('http://localhost:3002', {
            'reconnection': true,
            'reconnectionDelay': 2000,
            'reconnectionDelayMax': 4000,
            'reconnectionAttempts': 2
        });
    }

    render() {
        return (
            <Switch>
                {/*<ErrorBoundary>*/}
                    <Route exact path={'/'} component={() => <Dashboard socket={this.socket}/>}/>
                    <Route path={'/scan'} component={() => <Scan socket={this.socket}/>}/>
                    <Route path={'/history'} component={() => <History socket={this.socket}/>}/>
                {/*</ErrorBoundary>*/}
            </Switch>
        );
    }
}

export default Content;
