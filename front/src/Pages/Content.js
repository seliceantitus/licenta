import React from 'react';
import {Route, Switch} from "react-router-dom";
import Dashboard from "./Dash/Dashboard";

import openSocket from 'socket.io-client';
import ErrorBoundary from "./ErrorBoundary";

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
                <Route exact path={'/'} component={() =>
                    <ErrorBoundary>
                        <Dashboard socket={this.socket}/>
                    </ErrorBoundary>
                }/>
                <Route path={'/scan'} component={() => <h1>Test</h1>}/>
            </Switch>
        );
    }
}

export default Content;
