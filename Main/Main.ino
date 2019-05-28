#include "LCD.h"
#include "LED.h"
#include "Motor.h"
#include "Sensor.h"
#include "Switch.h"
#include "Constants.h"
#include "JsonSerial.h"

#include <ArduinoJson.h>
#include <stdio.h>

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

bool isRunning = false;
bool isPaused = false;

int layer = 0;

int turntableStep = 20;
int sensorAxisStep = 20;

int turntableTurns = 0;
int sensorAxisTurns = 0;

int infinityResults = 0;

void setup() {
  gLed.on();
  yLed.on();
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

  gLed.off();
  yLed.off();
  rLed.off();
}

/***************************
  Serial Json sender functions
****************************/

void sendConfigSuccess() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", CONFIG, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendStartScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", START_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendPauseScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", PAUSE_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendStopScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", STOP_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}


void sendSensorData() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", SENSOR, false, 0, NULL);
  JsonSerial::JsonNode action = jSerial.createStringNode("action", "measurement", false, 0, NULL);
  JsonSerial::JsonNode data_adc = jSerial.createFloatNode("analog", sensor.getADCValue(), false, 0, NULL);
  JsonSerial::JsonNode data_voltage = jSerial.createFloatNode("voltage", sensor.getVoltage(), false, 0, NULL);
  JsonSerial::JsonNode data_distance = jSerial.createFloatNode("distance", sensor.getDistance(), false, 0, NULL);
  JsonSerial::JsonNode *data_children[] = { &data_adc, &data_voltage, &data_distance };
  JsonSerial::JsonNode data = jSerial.createStringNode("data", "", true, 3, data_children);

  JsonSerial::JsonNode *list[] = { &component, &action, &data };

  jSerial.sendJson(list, 3);
}

void sendMotorData(int steps, int rotations, char *locationValue) {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", MOTOR, false, 0, NULL);
  JsonSerial::JsonNode location = jSerial.createStringNode("location", locationValue, false, 0, NULL);
  JsonSerial::JsonNode action = jSerial.createStringNode("action", "turn", false, 0, NULL);
  JsonSerial::JsonNode data_steps = jSerial.createFloatNode("steps", steps, false, 0, NULL);
  JsonSerial::JsonNode data_rotations = jSerial.createFloatNode("turns", rotations, false, 0, NULL);
  JsonSerial::JsonNode *data_children[] = { &data_steps, &data_rotations };
  JsonSerial::JsonNode data = jSerial.createStringNode("data", "", true, 2, data_children);

  JsonSerial::JsonNode *list[] = { &component, &location, &action, &data };

  jSerial.sendJson(list, 4);
}

void sendError(char* errorMessage) {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", ERR, false, 0, NULL);
  JsonSerial::JsonNode message = jSerial.createStringNode("message", errorMessage, false, 0, NULL);

  JsonSerial::JsonNode *list[] = { &component, &message };

  jSerial.sendJson(list, 2);
}

/****************************
  Handlers for serial events
****************************/

void startScan() {
  gLed.on();
  sendStartScan();
  isRunning = true;
  isPaused = false;
  delay(1000);
  gLed.off();
}

void pauseScan() {
  yLed.on();
  sendPauseScan();
  isPaused = true;
  delay(1000);
  yLed.off();
}

void stopScan() {
  rLed.on();
  sendStopScan();
  isRunning = false;
  isPaused = false;
  resetComponents();
  delay(1000);
  rLed.off();
}

void configMotor(int motorId, int stepSize) {
  if (motorId == AXIS_MOTOR) {
    gLed.on();
    sensorAxisStep = stepSize;
    sendConfigSuccess();
    gLed.off();
  } else if (motorId == TURNTABLE_MOTOR) {
    gLed.on();
    turntableStep = stepSize;
    sendConfigSuccess();
    gLed.off();
  } else {
    rLed.on();
    sendError("Invalid motor requested.");
    rLed.off();
  }
  delay(1000);
}

/****************************
  Functions
****************************/

void fetchSerialData() {
  String data = Serial.readString();
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, data);
  if (error) {
    rLed.on();
    sendError(error.c_str());
    rLed.off();
  } else {
    int command = doc["command"];
    if (command == START_SCAN) {
      startScan();
    } else if (command == PAUSE_SCAN) {
      pauseScan();
    } else if (command == STOP_SCAN) {
      stopScan();
    } else if (command == CONFIG) {
      int component = doc["component"];
      int stepSize = doc["stepSize"];
      configMotor(component, stepSize);
    }
  }
}

void measure() {
  sensor.measure();
  if (sensor.getDistance() == 0) {
    infinityResults += 1;
  }
  sendSensorData();
}

void turnMotors() {
  turntable.turn(turntableStep);
  turntableTurns += turntableStep;
}

bool checkLimits() {
  return (limSw1.active() || limSw2.active());
}

void resetComponents() {
  sensorAxis.setDirection(LEFT);
  sensorAxis.turn(sensorAxisTurns);
  sensorAxis.setDirection(RIGHT);
  isRunning = false;
  isPaused = false;
  layer = 0;
  sensorAxisTurns = 0;
  turntableTurns = 0;
  delay(1000);
}

void loop() {
  long s = millis();
  if (Serial.available()) {
    fetchSerialData();
  }
  if (isRunning && !isPaused) {
    if (turntableTurns == 200) {
      layer += 1;
      turntableTurns = 0;
      sensorAxis.turn(sensorAxisStep);
      sensorAxisTurns += sensorAxisStep;
    }
    measure();
    turnMotors();
    if (checkLimits()) {
      resetComponents();
    }
  }
  long e = millis();
}
