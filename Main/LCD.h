#ifndef LCD_h
#define LCD_h

#include "Arduino.h"

#include <TouchScreen.h>
#include <Adafruit_GFX.h>
#include <MCUFRIEND_kbv.h>

class LCD {
  public:
    LCD();
    LCD(int rotation);
    void rst();
    void calibrate(int TS_LEFT, int TS_RT, int TS_TOP, int TS_BOT);
    void fill(uint16_t color);
    void moveCursor(int x, int y);
    void textColor(uint16_t color, uint16_t bg);
    void textSize(uint8_t s);
    void printText(char *text);
    void fastLine(int dir, int x, int y, int l, uint16_t color);
    void line(int x0, int y0, int x1, int y1, uint16_t color);
    void rect(bool fill, int x, int y, int w, int h, uint16_t color);
    void initButton(int buttonIndex, int16_t x, int16_t y, uint16_t w, uint16_t h, uint16_t outline, uint16_t fill, uint16_t textColor, char* label, uint8_t textSize);
    void drawButton(int buttonIndex, bool inverted);
    void updatePressState(int buttonIndex);
    bool getPressState(int buttonIndex);
    bool getJustPressedState(int buttonIndex);
    bool getJustReleasedState(int buttonIndex);
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
