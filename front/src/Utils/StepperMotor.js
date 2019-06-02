class StepperMotor {

    constructor(stepDegree, stepIncrement) {
        this.stepDegree = stepDegree;
        this.stepIncrement = stepIncrement;
        this.fullRotationSteps = 200;
    }

    getStepDegree() {
        return this.stepDegree;
    }

    setStepDegree(stepDegree) {
        this.stepDegree = stepDegree;
    }

    getStepIncrement() {
        return this.stepIncrement;
    }

    setStepIncrement(stepIncrement) {
        this.stepIncrement = stepIncrement;
    }

    getSteps() {
        return this.fullRotationSteps / this.stepIncrement;
    }

    getAngle() {
        return this.stepIncrement * this.stepDegree;
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
