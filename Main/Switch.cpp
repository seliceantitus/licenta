#include "Arduino.h"
#include "Switch.h"
#include "Constants.h"

Switch::Switch(int pin) {
  _pin = pin;
  pinMode(_pin, INPUT);
}

bool Switch::active() {
  return digitalRead(_pin) == HIGH;
}
