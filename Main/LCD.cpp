#include "LCD.h"

#include <TouchScreen.h>
#include <Adafruit_GFX.h>
#include <MCUFRIEND_kbv.h>

#define MINPRESSURE 100
#define MAXPRESSURE 1000

MCUFRIEND_kbv tft;

const int XP = 6, XM = A2, YP = A1, YM = 7;
TouchScreen _ts = TouchScreen(XP, YP, XM, YM, 300);

Adafruit_GFX_Button startButton;
Adafruit_GFX_Button cancelButton;
Adafruit_GFX_Button buttons[] = {
  startButton,
  cancelButton
};

bool LCD::getTouch() {
  TSPoint p = _ts.getPoint();
  pinMode(YP, OUTPUT);      //restore shared pins
  pinMode(XM, OUTPUT);
  digitalWrite(YP, HIGH);   //because TFT control pins
  digitalWrite(XM, HIGH);
  bool pressed = (p.z > MINPRESSURE && p.z < MAXPRESSURE);
  if (pressed) {
    if (_currentOrientation == 1) {
      _touchX = map(p.y, _TS_LEFT, _TS_RT, 0, 320);
      _touchY = map(p.x, _TS_TOP, _TS_BOT, 0, 240);
    } else {
      _touchX = map(p.x, _TS_LEFT, _TS_RT, 0, tft.width());
      _touchY = map(p.y, _TS_TOP, _TS_BOT, 0, tft.height());
    }
  }
  return pressed;
}

LCD::LCD() {
    
}

LCD::LCD(int rotation) {
  uint16_t ID = tft.readID();
  if (ID == 0xD3D3) ID = 0x9486;
  tft.begin(ID);
  tft.setRotation(rotation);
  _currentOrientation = rotation;
  if (rotation == 1) {
    _TS_LEFT = 946;
    _TS_RT = 169;
    _TS_TOP = 922;
    _TS_BOT = 135;
  } else {
    _TS_LEFT = 134;
    _TS_RT = 921;
    _TS_TOP = 938;
    _TS_BOT = 164;
  }
}

void LCD::rst() {
  tft.reset();
}

void LCD::calibrate(int TS_LEFT, int TS_RT, int TS_TOP, int TS_BOT) {
  _TS_LEFT = TS_LEFT;
  _TS_RT = TS_RT;
  _TS_TOP = TS_TOP;
  _TS_BOT = TS_BOT;
}

void LCD::fill(uint16_t color) {
  tft.fillScreen(color);
}

void LCD::moveCursor(int x, int y) {
  tft.setCursor(x, y);
}

void LCD::textColor(uint16_t color, uint16_t bg){
  if (bg == -1) tft.setTextColor(color);
  else tft.setTextColor(color, bg);
}

void LCD::textSize(uint8_t s){
  tft.setTextSize(s);
}

void LCD::printText(char *text){
  tft.print(text);
}

void  LCD::fastLine(int dir, int x, int y, int l, uint16_t color){
  if (dir == 0) tft.drawFastHLine(x, y, l, color);
  else tft.drawFastVLine(x, y, l, color);
}

void LCD::line(int x0, int y0, int x1, int y1, uint16_t color){
  tft.drawLine(x0, y0, x1, y1, color);
}

void LCD::rect(bool fill, int x, int y, int w, int h, uint16_t color){
  if (fill) tft.fillRect(x, y, w, h, color);
  else tft.drawRect(x, y, w, h, color);
}

void LCD::initButton(int buttonIndex, int16_t x, int16_t y, uint16_t w, uint16_t h, uint16_t outline, uint16_t fill, uint16_t textColor, char* label, uint8_t textSize) {
  buttons[buttonIndex].initButton(&tft, x, y, w, h, outline, fill, textColor, label, textSize);
}

void LCD::drawButton(int buttonIndex, bool inverted) {
  buttons[buttonIndex].drawButton(inverted);
}

void LCD::updatePressState(int buttonIndex) {
  bool touchPress = LCD::getTouch();
  buttons[buttonIndex].press(touchPress & buttons[buttonIndex].contains(_touchX, _touchY));
}

bool LCD::getPressState(int buttonIndex) {
  return buttons[buttonIndex].isPressed();
}

bool LCD::getJustPressedState(int buttonIndex) {
  return buttons[buttonIndex].justPressed();
}

bool LCD::getJustReleasedState(int buttonIndex) {
  return buttons[buttonIndex].justReleased();
}
