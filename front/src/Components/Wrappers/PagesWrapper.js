import React from "react";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import Scan from "../../Pages/Scan/Scan";
import History from "../../Pages/History/History";
import Help from "../../Pages/Help/Help";
import {Route, Switch} from "react-router-dom";
import Viewer from "../../Pages/Viewer/Viewer";

class PagesWrapper extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {communicationManager, axisMotor, tableMotor, board} = this.props;
        return (
            <Switch>
                <Route exact path={'/'}
                       component={() =>
                           <Dashboard
                               communicationManager={communicationManager}
                               axisMotor={axisMotor}
                               tableMotor={tableMotor}
                               board={board}
                           />
                       }
                />
                <Route path={'/scan'}
                       component={() =>
                           <Scan
                               communicationManager={communicationManager}
                               axisMotor={axisMotor}
                               tableMotor={tableMotor}
                               board={board}
                           />
                       }
                />
                <Route path={'/history'} component={History}/>
                <Route path={'/viewer/:scan_id'} component={Viewer}/>
                <Route path={'/help'} component={Help}/>
            </Switch>
        );
    }

}

export default PagesWrapper;