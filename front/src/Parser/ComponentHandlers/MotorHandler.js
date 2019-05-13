import {MOTOR} from '../../Constants/ParserConstants';

function motorParse(component, json) {
    const actions = MOTOR.ACTIONS;
    switch (json.action) {
        case actions.TURN.ID:
            console.log('Turn');
            break;
        default:
            break;
    }
}

export default motorParse;