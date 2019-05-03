#ifndef Motor_h
#define Motor_h

#include "Arduino.h"

/**

   1B 1A 2A 2B
   BL GR BU RD

*/

class Motor {
  public:
    Motor(int dir, int enablePin, int resetPin, int sleepPin, int stepPin, int dirPin);
    Motor(int enablePin, int resetPin, int sleepPin, int stepPin, int dirPin);
    void enable();
    void resetMotor();
    void setDirection(int dir);
    void turn();
    void turn(int numberOfSteps);
    int getStepPin() {
      return _stepPin;
    };
    int getDirPin() {
      return _dirPin;
    };
    int getEnablePin() {
      return _enablePin;
    };
    int getSleepPin() {
      return _sleepPin;
    };
    int getResetPin() {
      return _resetPin;
    };
  private:
    int _stepPin;
    int _dirPin;
    int _enablePin;
    int _sleepPin;
    int _resetPin;
};
#endif
