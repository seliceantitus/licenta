#include "Arduino.h"
#include "Motor.h"

int currentDirection = -1;

Motor::Motor(int dir, int enablePin, int resetPin, int sleepPin, int stepPin, int dirPin) {
  currentDirection = dir;
  _stepPin = stepPin;
  _dirPin = dirPin;
  _enablePin = enablePin;
  _sleepPin = sleepPin;
  _resetPin = resetPin;

  pinMode(_enablePin, OUTPUT);
  pinMode(_sleepPin, OUTPUT);
  pinMode(_resetPin, OUTPUT);
  pinMode(_stepPin, OUTPUT);
  pinMode(_dirPin, OUTPUT);

  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  digitalWrite(_resetPin, HIGH);
  digitalWrite(_stepPin, LOW);
}

Motor::Motor(int enablePin, int resetPin, int sleepPin, int stepPin, int dirPin) {
  _stepPin = stepPin;
  _dirPin = dirPin;
  _enablePin = enablePin;
  _sleepPin = sleepPin;
  _resetPin = resetPin;

  pinMode(_enablePin, OUTPUT);
  pinMode(_sleepPin, OUTPUT);
  pinMode(_resetPin, OUTPUT);
  pinMode(_stepPin, OUTPUT);
  pinMode(_dirPin, OUTPUT);

  digitalWrite(_enablePin, LOW);
  digitalWrite(_sleepPin, LOW);
  digitalWrite(_resetPin, HIGH);
  digitalWrite(_stepPin, LOW);
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
  delayMicroseconds(1000);
  digitalWrite(_stepPin, LOW);
  delayMicroseconds(1000);
  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  delay(50);
}

void Motor::turn(int numberOfSteps) {
  digitalWrite(_sleepPin, HIGH);
  delay(50);
  digitalWrite(_enablePin, LOW);
  for (int rotations = 0; rotations < numberOfSteps; rotations++) {
    digitalWrite(_stepPin, HIGH);
    delayMicroseconds(1000);
    digitalWrite(_stepPin, LOW);
    delayMicroseconds(1000);
  }
  digitalWrite(_enablePin, HIGH);
  digitalWrite(_sleepPin, LOW);
  delay(50);
}
