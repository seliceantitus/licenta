#ifndef Sensor_h
#define Sensor_h

#include "Arduino.h"

class Sensor {
  public:
    Sensor(int dataPin);
    Sensor(int dataPin, int sampleSize);
    void setSampleSize(int sampleSize);
    void measure();
    float getADCValue();
    float getVoltage();
    float getDistance();
    int getDataPin(){ return _dataPin; };
    int getSampleSize(){ return _sampleSize; };
  private:
    int _dataPin;
    float _adcValue;
    float _voltage;
    float _distance;
    int _sampleSize;
};
#endif
