const actions = require("../constants/actions").SENSOR.ACTIONS;

class SensorHandler {
    process(jsonData) {
        switch(jsonData.action.toString()){
            case actions.MEASUREMENT:
                console.log(jsonData.data);
                break;
            default:
                console.log("Unknown action", jsonData.action);
                break;
        }
    }
}

module.exports = SensorHandler;