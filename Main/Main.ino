#include <string.h>

#include "LCD.h"
#include "LED.h"
#include "Motor.h"
#include "Sensor.h"
#include "Switch.h"
#include "Constants.h"

LCD screen;
LED gLed = LED(GLED);
LED yLed = LED(YLED);
LED rLed = LED(RLED);
Switch limSw1 = Switch(LIMSW1);
Switch limSw2 = Switch(LIMSW2);
Sensor sensor = Sensor(IRSENSOR, 5000);
Motor sensorAxis = Motor(23, 31, 33, 35, 37);
Motor turntable = Motor(22, 30, 32, 34, 36);

void setup() {
  Serial.begin(9600);
  analogReference(EXTERNAL);
  
  screen = LCD(LANDSCAPE);

  gLed.on();
  yLed.on();
  rLed.on();
  
  sensorAxis.enable();
  turntable.enable();
}

void start(){
  
}

void loop() {
  Serial.println(digitalRead(iPin));
  Serial.println(interruptCount);
  delay(1000);
}
