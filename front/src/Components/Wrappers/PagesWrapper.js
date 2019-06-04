import React from "react";
import {Route, Switch} from "react-router-dom";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import Scan from "../../Pages/Scan/Scan";
import History from "../../Pages/History/History";
import Help from "../../Pages/Help/Help";

class PagesWrapper extends React.Component {

    render() {
        const {communicationManager, axisMotor, tableMotor, board, toastCallback} = this.props;
        return (
            <Switch>
                <Route exact path={'/'}
                       component={() =>
                           <Dashboard
                               communicationManager={communicationManager}
                               axisMotor={axisMotor}
                               tableMotor={tableMotor}
                               board={board}
                               toastCallback={toastCallback}
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
                               toastCallback={toastCallback}
                           />
                       }
                />
                <Route path={'/history'}
                       component={() =>
                           <History
                               communicationManager={communicationManager}
                               toastCallback={toastCallback}
                           />
                       }
                />
                <Route path={'/help'} component={Help}/>
            </Switch>
        );
    }

}

export default PagesWrapper;