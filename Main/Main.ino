#include "LCD.h"
#include "LED.h"
#include "Motor.h"
#include "Sensor.h"
#include "Switch.h"
#include "Constants.h"
#include "JsonSerial.h"

#include <ArduinoJson.h>
#include<stdio.h>
#include <Thread.h>
#include <ThreadController.h>
#include <TimerOne.h>

LCD screen;
LED gLed = LED(GLED);
LED yLed = LED(YLED);
LED rLed = LED(RLED);
Switch limSw1 = Switch(LIMSW1);
Switch limSw2 = Switch(LIMSW2);
Sensor sensor = Sensor(IRSENSOR, 1000);
Motor sensorAxis = Motor(23, 31, 33, 35, 37);
Motor turntable = Motor(22, 30, 32, 34, 36);
JsonSerial jSerial = JsonSerial();

Thread *lcdThread = new Thread();
ThreadController threadController = ThreadController();

volatile int activeScreen = 0;
volatile bool isRunning = false;

int turntableTurns = 0;
int turntableStep = 20;
int turntableFullRotations = 0;
int sensorAxisTurns = 0;
int sensorAxisStep = 50;
void checkTouchInput() {
  if (!isRunning) {
    screen.updatePressState(START_BUTTON);
    if (screen.getJustPressedState(START_BUTTON)) {
      screen.drawButton(START_BUTTON, true);
    } else if (screen.getJustReleasedState(START_BUTTON)) {
      screen.drawButton(CANCEL_BUTTON, false);
      isRunning = true;
    }
  } else {
    screen.updatePressState(CANCEL_BUTTON);
    if (screen.getJustPressedState(CANCEL_BUTTON)) {
      screen.drawButton(CANCEL_BUTTON, true);
    } else if (screen.getJustReleasedState(CANCEL_BUTTON)) {
      screen.drawButton(START_BUTTON, false);
      isRunning = false;
    }
  }
}

void timerCallback() {
  threadController.run();
}

void setup() {
  rLed.on();

  Serial.begin(9600);
  analogReference(EXTERNAL);

  screen = LCD(LANDSCAPE);
  screen.fill(WHITE);
  screen.initButton(START_BUTTON, 60, 120, 100, 200, RED, BLACK, WHITE, "Start", 3);
  screen.initButton(CANCEL_BUTTON, 60, 120, 100, 200, BLACK, RED, WHITE, "Stop", 3);
  screen.drawButton(START_BUTTON, false);

  sensorAxis.enable();
  turntable.enable();
  sensorAxis.setDirection(RIGHT);
  turntable.setDirection(LEFT);

  lcdThread->onRun(checkTouchInput);
  lcdThread->setInterval(20);
  threadController.add(lcdThread);

  Timer1.initialize(5000);
  Timer1.attachInterrupt(timerCallback);
  Timer1.start();

  rLed.off();
}

void portOpen() {

}

void sendSensorData() {
  JsonSerial::JsonNode component = jSerial.createStringNode("component", "sensor", false, 0, NULL);
  JsonSerial::JsonNode action = jSerial.createStringNode("action", "measurement", false, 0, NULL);
  JsonSerial::JsonNode data_adc = jSerial.createFloatNode("adc", sensor.getADCValue(), false, 0, NULL);
  JsonSerial::JsonNode data_voltage = jSerial.createFloatNode("voltage", sensor.getVoltage(), false, 0, NULL);
  JsonSerial::JsonNode data_distance = jSerial.createFloatNode("distance", sensor.getDistance(), false, 0, NULL);
  JsonSerial::JsonNode *data_children[] = { &data_adc, &data_voltage, &data_distance };
  JsonSerial::JsonNode data = jSerial.createStringNode("data", "", true, 3, data_children);

  JsonSerial::JsonNode *list[] = { &component, &action, &data };

  jSerial.sendJson(list, 3);
}

void portClose() {

}

void fetchSerialData() {
  String data = Serial.readString();
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, data);

  if (error) {
    Serial.println(error.c_str());
  } else {
    char* command = doc["command"];
  }
}

void loop() {
  long s = millis();
  if (Serial.available()) {
    fetchSerialData();
  }
  if (limSw1.active() && !isRunning) {
    isRunning = true;
    delay(1000);
  }
  if (isRunning) {
    if (turntableTurns == 200) {
      turntableFullRotations += 1;
      turntableTurns = 0; 
      sensorAxis.turn(sensorAxisStep);
      sensorAxisTurns += sensorAxisStep;
    }
    noInterrupts();
    sensor.measure();
    interrupts();
    sendSensorData();
    noInterrupts();
    turntable.turn(turntableStep);
    turntableTurns += turntableStep;
    interrupts();
    if (limSw1.active()) {
      noInterrupts();
      sensorAxis.setDirection(LEFT);
      sensorAxis.turn(sensorAxisTurns);
      sensorAxis.setDirection(RIGHT);
      interrupts();
      isRunning = false;
      sensorAxisTurns = 0;
      turntableTurns = 0;
      turntableFullRotations = 0;
      delay(2000);
    }
  }
  long e = millis();
  Serial.println(e - s);
}
