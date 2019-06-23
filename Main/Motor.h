#ifndef Motor_h
#define Motor_h

#include "Arduino.h"

/**

   1B 1A 2A 2B
   BL GR BU RD

*/

class Motor {
  public:
//    Motor(int dir, int enablePin, int resetPin, int sleepPin, int stepPin, int dirPin);
    Motor(int enablePin, int ms1, int ms2, int ms3, int resetPin, int sleepPin, int stepPin, int dirPin);
    Motor(int enablePin, int ms1, int ms2, int ms3, int resetPin, int sleepPin, int stepPin, int dirPin, int delayAmount, int ms1Value, int ms2Value, int ms3Value);
    void enable();
    void resetMotor();
    void setDirection(int dir);
    void turn();
    void turn(long numberOfSteps);
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
    int _ms1;
    int _ms2;
    int _ms3;
    int _delayAmount;
};
#endif
