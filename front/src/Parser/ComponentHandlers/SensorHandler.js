import {SENSOR} from '../../Constants/ParserConstants';
import InvalidJsonException from "../../Exceptions/InvalidJsonException";
import {
    INVALID_COMPONENT_ACTION,
    INVALID_COMPONENT_ACTION_DATA,
    MISSING_COMPONENT_ACTION, MISSING_COMPONENT_ACTION_DATA
} from "../../Constants/Errors";

function extractData(json, dataKeys) {
    if (!json.data) throw new InvalidJsonException(MISSING_COMPONENT_ACTION_DATA);
    const keys = Object.keys(json);
    if (JSON.stringify(keys) !== JSON.stringify(dataKeys))
        throw new InvalidJsonException(INVALID_COMPONENT_ACTION_DATA);
    const data = {};
    keys.forEach((key) => data[key] = json[key]);
    return data;
}

function sensorParse(component, json) {
    const actions = SENSOR.ACTIONS;
    switch (json.actions) {
        case actions.MEASUREMENT.ID:
            const sensorData = extractData(json.data, actions.MEASUREMENT.DATA);
            const newSensorData = {
                distance: sensorData.distance,
                analog: sensorData.analog,
                voltage: sensorData.voltage
            };
            component.setState({sensorData: newSensorData});
            break;
        case undefined:
            throw new InvalidJsonException(MISSING_COMPONENT_ACTION);
        default:
            throw new InvalidJsonException(INVALID_COMPONENT_ACTION);
    }
}

export default sensorParse;