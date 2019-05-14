import {PROGRAM} from '../../Constants/ParserConstants';
import InvalidJsonException from "../../Exceptions/InvalidJsonException";
import {INVALID_COMPONENT_ACTION, MISSING_COMPONENT_ACTION} from "../../Constants/Errors";

function programParse(component, json) {
    switch (json.action) {
        case PROGRAM.ACTIONS.START.ID:
            console.log("Program starting");
            break;

        case PROGRAM.ACTIONS.STOP.ID:
            console.log("Program stopping");
            break;

        case undefined:
            throw new InvalidJsonException(MISSING_COMPONENT_ACTION);

        default:
            throw new InvalidJsonException(INVALID_COMPONENT_ACTION);
    }
}

export default programParse;