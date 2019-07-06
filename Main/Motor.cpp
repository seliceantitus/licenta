#include "Arduino.h"
#include "Motor.h"

int currentDirection = -1;

Motor::Motor(int enablePin, int ms1, int ms2, int ms3, int resetPin, int sleepPin, int stepPin, int dirPin) {
  _stepPin = stepPin;
  _dirPin = dirPin;
  _enablePin = enablePin;
  _sleepPin = sleepPin;
  _resetPin = resetPin;
  _ms1 = ms1;
  _ms2 = ms2;
  _ms3 = ms3;
  _delayAmount = 1500;

  pinMode(_enablePin, OUTPUT);
  pinMode(_sleepPin, OUTPUT);
  pinMode(_resetPin, OUTPUT);
  pinMode(_stepPin, OUTPUT);
  pinMode(_dirPin, OUTPUT);

  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  digitalWrite(_resetPin, HIGH);
  digitalWrite(_stepPin, LOW);
  digitalWrite(_ms1, LOW);
  digitalWrite(_ms2, LOW);
  digitalWrite(_ms3, LOW);
}

Motor::Motor(int enablePin, int ms1, int ms2, int ms3, int resetPin, int sleepPin, int stepPin, int dirPin, int delayAmount, int ms1Value, int ms2Value, int ms3Value) {
  _stepPin = stepPin;
  _dirPin = dirPin;
  _enablePin = enablePin;
  _sleepPin = sleepPin;
  _resetPin = resetPin;
  _ms1 = ms1;
  _ms2 = ms2;
  _ms3 = ms3;
  _delayAmount = delayAmount;

  pinMode(_enablePin, OUTPUT);
  pinMode(_sleepPin, OUTPUT);
  pinMode(_resetPin, OUTPUT);
  pinMode(_stepPin, OUTPUT);
  pinMode(_dirPin, OUTPUT);

  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  digitalWrite(_resetPin, HIGH);
  digitalWrite(_stepPin, LOW);
  digitalWrite(_ms1, ms1Value);
  digitalWrite(_ms2, ms2Value);
  digitalWrite(_ms3, ms3Value);
}

void Motor::enable() {
  digitalWrite(_sleepPin, LOW);
  digitalWrite(_resetPin, HIGH);
}

void Motor::resetMotor() {
  digitalWrite(_resetPin, LOW);
  delay(1000);
  digitalWrite(_resetPin, HIGH);
}

void Motor::setDirection(int dir) {
  digitalWrite(_dirPin, dir);
  currentDirection = dir;
}

void Motor::turn() {
  digitalWrite(_sleepPin, HIGH);
  delay(50);
  digitalWrite(_enablePin, LOW);
  digitalWrite(_stepPin, HIGH);
  delayMicroseconds(_delayAmount);
  digitalWrite(_stepPin, LOW);
  delayMicroseconds(_delayAmount);
  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  delay(50);
}

void Motor::turn(long numberOfSteps) {
  digitalWrite(_sleepPin, HIGH);
  delay(50);
  digitalWrite(_enablePin, LOW);
  for (int rotations = 0; rotations < numberOfSteps; rotations++) {
    digitalWrite(_stepPin, HIGH);
    delayMicroseconds(_delayAmount);
    digitalWrite(_stepPin, LOW);
    delayMicroseconds(_delayAmount);
  }
  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  delay(50);
}
