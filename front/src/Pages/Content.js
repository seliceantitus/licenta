import React from 'react';
import {Route, Switch} from "react-router-dom";
import Dashboard from "./Dash/Dashboard";

class Content extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path={'/'} component={Dashboard}/>
                <Route path={'/scan'} component={() => <h1>Test</h1>}/>
            </Switch>
        );
    }
}

export default Content;
