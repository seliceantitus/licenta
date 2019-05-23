import React from "react";
import Dashboard from "../../Pages/Dash/Dashboard";
import Scan from "../../Pages/Scan/Scan";
import History from "../../Pages/History/History";
import Help from "../../Pages/Help/Help";
import {Route, Switch} from "react-router-dom";

class PagesWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.communicationManager = this.props.communicationManager;
        console.log('[PAGES WRAPPER] Constructed');
    }

    render() {
        return (
            <Switch>
                <Route exact path={'/'}
                       component={() => <Dashboard communicationManager={this.communicationManager}/>}
                />
                <Route path={'/scan'}
                       component={() => <Scan communicationManager={this.communicationManager}/>}
                />
                <Route path={'/history'}
                       component={() => <History communicationManager={this.communicationManager}/>}
                />
                <Route path={'/help'} component={Help}/>
            </Switch>
        );
    }

}

export default PagesWrapper;