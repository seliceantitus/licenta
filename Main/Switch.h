#ifndef Switch_h
#define Switch_h

#include "Arduino.h"

class Switch {
  public:
    Switch(int pin);
    bool active();
    int getPin() {
      return _pin;
    };
  private:
    int _pin;
};
#endif
