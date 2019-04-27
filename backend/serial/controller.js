const commands = require("./constants/commands");
const SensorHandler = require('./handlers/sensorHandler');
const MotorHandler = require('./handlers/motorHandler');
const LedHandler = require('./handlers/ledHandler');
const SwitchHandler = require('./handlers/switchHandler');

class Controller {
    constructor(){
        this.sensorHandler = new SensorHandler();
        this.motorHandler = new MotorHandler();
        this.ledHandler = new LedHandler();
        this.switchHandler = new SwitchHandler();
    }

    parse(jsonData) {
        switch (jsonData.component) {
            case commands.SENSOR:
                return this.sensorHandler.process(jsonData);
            case commands.SWITCH:
                return this.switchHandler.process(jsonData);
            case commands.MOTOR:
                return this.motorHandler.process(jsonData);
            case commands.LED:
                return this.ledHandler.process(jsonData);
            default:
                console.log("Unknown command");
                console.log(jsonData);
        }
    }
}

module.exports = Controller;