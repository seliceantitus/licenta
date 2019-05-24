#include "Arduino.h"
#include "Sensor.h"

Sensor::Sensor(int dataPin) {
  _dataPin = dataPin;
  _voltage = 0;
  _distance = 0;
  _sampleSize = 100;
  pinMode(_dataPin, INPUT);
}

Sensor::Sensor(int dataPin, int sampleSize) {
  _dataPin = dataPin;
  _voltage = 0;
  _distance = 0;
  _sampleSize = sampleSize;
  pinMode(_dataPin, INPUT);
}

void Sensor::setSampleSize(int sampleSize) {
  _sampleSize = sampleSize;
}

void Sensor::measure() {
  float totalADC = 0.0f;
  float totalVoltage = 0.0f;
  float totalDistance = 0.0f;

  for (int i = 0; i < _sampleSize; i++) {
    float sensorValue = analogRead(_dataPin);
    float voltage = sensorValue * (3.3 / 1023.0);
    //    float distance = 1 / ((0.0002 * sensorValue) - 0.0099);
    //    float distance = 5000 / (sensorValue - 54);
    float distance = 6488 / (sensorValue - 70);
    totalADC += sensorValue;
    totalDistance += distance;
    totalVoltage += voltage;
  }

  _adcValue = totalADC / _sampleSize;
  _voltage = totalVoltage / _sampleSize;
  _distance = totalDistance / _sampleSize;
  if (isinf(_distance) || _distance > 50 || _distance < 0) _distance = 0.0;
}

float Sensor::getADCValue() {
  return _adcValue;
}

float Sensor::getVoltage() {
  return _voltage;
}

float Sensor::getDistance() {
  return _distance;
}
