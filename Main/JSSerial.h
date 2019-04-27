#ifndef JSSerial_h
#define JSSerial_h

#include "Arduino.h"


class JSSerial {
  public:
    JSSerial();
    void sendJSON();
    void parseJSON();
  private:
    int _TS_LEFT;
    int _TS_RT;
    int _TS_TOP;
    int _TS_BOT;
    int _touchX;
    int _touchY;
    int _currentOrientation;
    bool getTouch();
};
#endif
