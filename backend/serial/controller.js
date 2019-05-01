const actions = require("./constants/actions");
const SensorHandler = require('./handlers/sensorHandler');
const ProgramHandler = require('./handlers/programHandler');
const ErrorHandler = require('./handlers/errorHandler');

class Controller {
    constructor(){
        this.sensorHandler = new SensorHandler();
        this.programHandler = new ProgramHandler();
        this.errorHandler = new ErrorHandler();
    }

    parse(jsonData) {
        switch (jsonData.component.toString()) {
            case actions.SENSOR.ID:
                return this.sensorHandler.process(jsonData);
            case actions.PROGRAM.ID:
                return this.programHandler.process(jsonData);
            case actions.ERROR.ID:
                return this.errorHandler.process(jsonData);
            default:
                console.log("Unknown component", jsonData.component);
                break;
        }
    }
}

module.exports = Controller;