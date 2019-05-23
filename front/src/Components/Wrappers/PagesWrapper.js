import React from "react";
import Dashboard from "../../Pages/Dash/Dashboard";
import Scan from "../../Pages/Scan/Scan";
import History from "../../Pages/History/History";
import Help from "../../Pages/Help/Help";
import {Route, Switch} from "react-router-dom";

class PagesWrapper extends React.Component {
    constructor(props) {
        super(props);

        console.log('[PAGES WRAPPER] Constructed');
    }

    render() {
        const {communicationManager, stepperMotor} = this.props;
        return (
            <Switch>
                <Route exact path={'/'}
                       component={() =>
                           <Dashboard
                               communicationManager={communicationManager}
                               stepperMotor={stepperMotor}
                           />
                       }
                />
                <Route path={'/scan'}
                       component={() =>
                           <Scan
                               communicationManager={communicationManager}
                               stepperMotor={stepperMotor}
                           />
                       }
                />
                <Route path={'/history'} component={History}/>
                <Route path={'/help'} component={Help}/>
            </Switch>
        );
    }

}

export default PagesWrapper;