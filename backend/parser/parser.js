const actions = require("./constants/actions");
const MotorHandler = require('./handler/motorHandler');
const SensorHandler = require('./handler/sensorHandler');
const PortHandler = require('./handler/portHandler');
const ProgramHandler = require('./handler/programHandler');
const ErrorHandler = require('./handler/errorHandler');

class Parser {
    constructor(){
        this.motorHandler = new MotorHandler();
        this.sensorHandler = new SensorHandler();
        this.portHandler = new PortHandler();
        this.programHandler = new ProgramHandler();
        this.errorHandler = new ErrorHandler();
    }

    parse(jsonData) {
        switch (jsonData.component.toString()) {
            case actions.MOTOR.ID:
                return this.motorHandler.process(jsonData);
            case actions.SENSOR.ID:
                return this.sensorHandler.process(jsonData);
            case actions.PORT.ID:
                return this.portHandler.process(jsonData);
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

module.exports = Parser;