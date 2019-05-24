import motorParse from "./ComponentHandlers/MotorHandler";
import programParse from "./ComponentHandlers/ProgramHandler";
import sensorParse from './ComponentHandlers/SensorHandler';

import * as Constants from '../Constants/Communication';
import InvalidJsonException from "../Exceptions/InvalidJsonException";
import {INVALID_COMPONENT_ID, MISSING_COMPONENT_ID} from "../Constants/Messages";

function parse(component, json) {
    switch (json.component) {
        case Constants.MOTOR.ID:
            // motorParse(component, json);
            break;

        case Constants.PROGRAM.ID:
            // programParse(component, json);
            break;

        case Constants.SENSOR.ID:
            // sensorParse(component, json);
            break;

        case undefined:
            console.log('Parser.js', json);
            throw new InvalidJsonException(MISSING_COMPONENT_ID);

        default:
            console.log('Parser.js', json);
            throw new InvalidJsonException(INVALID_COMPONENT_ID);
    }
}

export default parse;