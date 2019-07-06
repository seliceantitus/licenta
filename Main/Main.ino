#include "LED.h"
#include "Motor.h"
#include "Sensor.h"
#include "Switch.h"
#include "Constants.h"
#include "JsonSerial.h"

#include <ArduinoJson.h>
#include <stdio.h>

LED gLed = LED(GLED);
LED yLed = LED(YLED);
LED rLed = LED(RLED);
Switch limSw1 = Switch(LIMSW1);
Switch limSw2 = Switch(LIMSW2);
Sensor sensor = Sensor(IRSENSOR, 1000);
Motor sensorAxis = Motor(23, 25, 27, 29, 31, 33, 35, 37, 750, LOW, LOW, LOW);
Motor turntable = Motor(22, 24, 26, 28, 30, 32, 34, 36, 2500, HIGH, HIGH, HIGH);
JsonSerial jSerial = JsonSerial();

bool isRunning = false;
bool isPaused = false;

int layer = 0;
int pointsPerLayer = 0;

int turntableStep = 4;
int turntableStepMultiplier = 16;
long sensorAxisStep = 200;

long turntableTurns = 0;
long sensorAxisTurns = 0;

int infinityResults = 0;

void setup() {
  gLed.on();
  yLed.on();
  rLed.on();

  Serial.begin(57600);
  analogReference(EXTERNAL);

  sendBoardBusy();

  sensorAxis.enable();
  turntable.enable();
  sensorAxis.setDirection(RIGHT);
  turntable.setDirection(LEFT);

  pointsPerLayer = 200 / turntableStep;

  gLed.off();
  yLed.off();
  rLed.off();

  sendBoardReady();
}

/***************************
  Serial Json sender functions
****************************/

void sendBoardBusy() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_BOARD_BUSY, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendBoardReady() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_BOARD_READY, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendConfigSuccess(int motorId) {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_CONFIG, false, 0, NULL);
  JsonSerial::JsonNode motor = jSerial.createIntNode("motor", motorId, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component, &motor };
  jSerial.sendJson(list, 2);
}

void sendStartScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_START_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendPauseScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_PAUSE_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendStopScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_STOP_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendFinishedScan() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_FINISHED_SCAN, false, 0, NULL);
  JsonSerial::JsonNode *list[] = { &component };
  jSerial.sendJson(list, 1);
}

void sendSensorData() {
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_SENSOR, false, 0, NULL);
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
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_MOTOR, false, 0, NULL);
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
  JsonSerial::JsonNode component = jSerial.createIntNode("component", RES_ERR, false, 0, NULL);
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
  isPaused = !isPaused;
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
    sendConfigSuccess(AXIS_MOTOR);
    gLed.off();
  } else if (motorId == TURNTABLE_MOTOR) {
    gLed.on();
    turntableStep = stepSize;
    pointsPerLayer = 200 / turntableStep;
    sendConfigSuccess(TURNTABLE_MOTOR);
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
    if (command == REQ_START_SCAN) {
      startScan();
    } else if (command == REQ_PAUSE_SCAN) {
      pauseScan();
    } else if (command == REQ_STOP_SCAN) {
      stopScan();
    } else if (command == REQ_CONFIG) {
      int component = doc["component"];
      int stepSize = doc["stepSize"];
      configMotor(component, stepSize);
    } else if (command == REQ_RESET) {
      resetComponents();
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
  turntable.turn(turntableStep * turntableStepMultiplier);
  turntableTurns += turntableStep;
  delay(100);
}

bool checkLimits() {
  return (limSw1.active() || limSw2.active());
}

bool checkOverObjectHeight() {
  if (infinityResults >= pointsPerLayer * 0.9) {
    sendFinishedScan();
    return true;
  }
  return false;
}

void resetComponents() {
  sensorAxis.setDirection(LEFT);
  delay(100);
  sensorAxis.turn(sensorAxisTurns);
  delay(100);
  sensorAxis.setDirection(RIGHT);
  isRunning = false;
  isPaused = false;
  layer = 0;
  sensorAxisTurns = 0;
  turntableTurns = 0;
  infinityResults = 0;
  delay(1000);
}

void loop() {
  long s = millis();
  if (Serial.available()) {
    fetchSerialData();
  }
  if (isRunning && !isPaused) {
    if (turntableTurns == 200) {
      if (checkOverObjectHeight()) {
        resetComponents();
        return;
      } else {
        layer += 1;
        turntableTurns = 0;
        infinityResults = 0;
        sensorAxis.turn(sensorAxisStep);
        sensorAxisTurns += sensorAxisStep;
      }
    }
    measure();
    delay(100);
    turnMotors();
    delay(100);
    if (checkLimits()) {
      sendFinishedScan();
      resetComponents();
      return;
    }
  }
  long e = millis();
}
