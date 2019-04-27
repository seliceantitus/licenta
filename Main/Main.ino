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

char message[10] = "Start";
int activeScreen = 0;
int tableTurns = 0;
int iPin = 21;
volatile int interruptCount = 0;

void handleForceCancel(){
  Serial.println("In interrupt");
  interruptCount++;
}

void setup() {
  Serial.begin(9600);
  analogReference(EXTERNAL);
  pinMode(iPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(iPin), handleForceCancel, RISING);
  screen = LCD(LANDSCAPE);
  sensorAxis.enable();
  turntable.enable();
}

void start(){
  if (tableTurns == 200){
    sensorAxis.turn(100);
    tableTurns = 0;
    delay(100);
  }
  sensor.measure();
  Serial.print("Sensor value: ");
  Serial.println(sensor.getADCValue());
  turntable.turn(50);
  tableTurns += 50;
  Serial.print("Total turns: ");
  Serial.println(tableTurns);
}

void loop() {
  Serial.println(digitalRead(iPin));
  Serial.println(interruptCount);
  delay(1000);
}
