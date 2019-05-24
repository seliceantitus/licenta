import {MESSAGE_CONFIG} from '../../Constants/Communication';
import InvalidJsonException from "../../Exceptions/InvalidJsonException";
import {
    INVALID_COMPONENT_ACTION,
    INVALID_COMPONENT_ACTION_DATA,
    MISSING_COMPONENT_ACTION,
    MISSING_COMPONENT_ACTION_DATA
} from "../../Constants/Messages";

function extractData(json, dataKeys) {
    if (!json)
        throw new InvalidJsonException(MISSING_COMPONENT_ACTION_DATA);

    if (JSON.stringify(Object.keys(json)) !== JSON.stringify(dataKeys))
        throw new InvalidJsonException(INVALID_COMPONENT_ACTION_DATA);

    const data = {};
    Object.keys(json).forEach((key) => data[key] = json[key]);
    return data;
}

function sensorParse(component, json) {
    switch (json.action) {
        case MESSAGE_CONFIG.SENSOR.ACTIONS.MEASUREMENT.ID:
            const sensorData = extractData(json.data, MESSAGE_CONFIG.SENSOR.ACTIONS.MEASUREMENT.DATA);
            component.setState({sensorData: sensorData});
            break;

        case undefined:
            throw new InvalidJsonException(MISSING_COMPONENT_ACTION);

        default:
            throw new InvalidJsonException(INVALID_COMPONENT_ACTION);
    }
}

export default sensorParse;