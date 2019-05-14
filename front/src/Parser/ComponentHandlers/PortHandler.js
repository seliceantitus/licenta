import {PORT} from '../../Constants/ParserConstants';
import InvalidJsonException from "../../Exceptions/InvalidJsonException";
import {INVALID_COMPONENT_ACTION, MISSING_COMPONENT_ACTION} from "../../Constants/Errors";
import {TOAST_SUCCESS} from "../../Constants/UI";
import {SERIAL_CONNECTION_SUCCESS, SERIAL_CONNECTION_CLOSED} from "../../Constants/Messages";

function portParse(component, json) {
    switch (json.action) {
        case PORT.ACTIONS.OPEN.ID:
            component.showToast(TOAST_SUCCESS, SERIAL_CONNECTION_SUCCESS);
            break;

        case PORT.ACTIONS.CLOSE.ID:
            component.showToast(TOAST_SUCCESS, SERIAL_CONNECTION_CLOSED);
            break;

        case undefined:
            console.log('PortHandler.js', json);
            throw new InvalidJsonException(MISSING_COMPONENT_ACTION);

        default:
            console.log('PortHandler.js', json);
            throw new InvalidJsonException(INVALID_COMPONENT_ACTION);
    }
}

export default portParse;