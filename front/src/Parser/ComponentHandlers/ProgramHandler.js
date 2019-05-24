import {MESSAGE_CONFIG} from '../../Constants/Communication';
import InvalidJsonException from "../../Exceptions/InvalidJsonException";
import {INVALID_COMPONENT_ACTION, MISSING_COMPONENT_ACTION} from "../../Constants/Messages";

function programParse(component, json) {
    switch (json.action) {
        case MESSAGE_CONFIG.PROGRAM.ACTIONS.START.ID:
            console.log("Program starting");
            break;

        case MESSAGE_CONFIG.PROGRAM.ACTIONS.STOP.ID:
            console.log("Program stopping");
            break;

        case undefined:
            throw new InvalidJsonException(MISSING_COMPONENT_ACTION);

        default:
            throw new InvalidJsonException(INVALID_COMPONENT_ACTION);
    }
}

export default programParse;