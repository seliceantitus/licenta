class StepperMotor {

    constructor(stepDegree, stepIncrement) {
        this.stepDegree = stepDegree;
        this.stepIncrement = stepIncrement;
        this.fullRotationSteps = 200;
    }

    setStepDegree(stepDegree) {
        this.stepDegree = stepDegree;
    }

    setStepIncrement(stepIncrement) {
        this.stepIncrement = stepIncrement;
    }

    getRadarLabels() {
        let degrees = [];
        let deg = 0;
        while (Math.ceil(deg) < 360) {
            degrees = [...degrees, deg.toFixed(1)];
            deg += (this.stepIncrement * this.stepDegree);
        }
        return degrees;
    }
}

export default StepperMotor;
