import {MOTOR} from '../../Constants/Communication';
import InvalidJsonException from "../../Exceptions/InvalidJsonException";
import {INVALID_COMPONENT_ACTION, MISSING_COMPONENT_ACTION} from "../../Constants/Messages";

function motorParse(component, json) {
    switch (json.action) {
        case MOTOR.ACTIONS.TURN.ID:
            console.log('Turn');
            break;

        case undefined:
            throw new InvalidJsonException(MISSING_COMPONENT_ACTION);

        default:
            throw new InvalidJsonException(INVALID_COMPONENT_ACTION);
    }
}

export default motorParse;