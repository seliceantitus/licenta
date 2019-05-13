import * as Constants from '../Constants/ParserConstants';
import sensorParse from './ComponentHandlers/SensorHandler';
import InvalidJsonException from "../Exceptions/InvalidJsonException";
import {INVALID_COMPONENT_ID, MISSING_COMPONENT_ID} from "../Constants/Errors";

function parse(component, data){
    switch (data.component) {
        case Constants.MOTOR.ID:
            console.log('MOTOR');
            break;
        case Constants.PORT.ID:
            console.log('PORT');
            break;
        case Constants.PROGRAM.ID:
            console.log('PROGRAM');
            break;
        case Constants.SENSOR.ID:
            try{
                sensorParse(component, data);
            } catch (exception) {
                throw exception;
            }
            break;
        case undefined:
            throw new InvalidJsonException(MISSING_COMPONENT_ID);
        default:
            throw new InvalidJsonException(INVALID_COMPONENT_ID);
    }
}

export default parse;