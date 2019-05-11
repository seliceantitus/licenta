class StepperMotor {

    constructor(stepDegree, stepIncrement) {
        this.state = {
            stepDegree: stepDegree,
            stepIncrement: stepIncrement,
            fullRotationSteps: 200
        }
    }

    getRadarLabels() {
        let degrees = [];
        let deg = 0;
        while (Math.ceil(deg) < 360) {
            console.log(deg);
            degrees = [...degrees, deg.toFixed(1)];
            deg += (this.state.stepIncrement * this.state.stepDegree);
        }
        return degrees;
    }
}

export default StepperMotor;
