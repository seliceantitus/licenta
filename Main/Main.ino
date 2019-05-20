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

volatile int activeScreen = 0;
volatile bool isRunning = false;

int turntableTurns = 0;
int turntableStep = 20;
int turntableFullRotations = 0;
int sensorAxisTurns = 0;
int sensorAxisStep = 50;

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

  rLed.off();
}

void sendSensorData() {
  JsonSerial::JsonNode component = jSerial.createStringNode("component", "sensor", false, 0, NULL);
  JsonSerial::JsonNode action = jSerial.createStringNode("action", "measurement", false, 0, NULL);
  JsonSerial::JsonNode data_adc = jSerial.createFloatNode("analog", sensor.getADCValue(), false, 0, NULL);
  JsonSerial::JsonNode data_voltage = jSerial.createFloatNode("voltage", sensor.getVoltage(), false, 0, NULL);
  JsonSerial::JsonNode data_distance = jSerial.createFloatNode("distance", sensor.getDistance(), false, 0, NULL);
  JsonSerial::JsonNode *data_children[] = { &data_adc, &data_voltage, &data_distance };
  JsonSerial::JsonNode data = jSerial.createStringNode("data", "", true, 3, data_children);

  JsonSerial::JsonNode *list[] = { &component, &action, &data };

  jSerial.sendJson(list, 3);
}

void sendMotorData(int steps, int rotations, char *locationValue){
  JsonSerial::JsonNode component = jSerial.createStringNode("component", "motor", false, 0, NULL);
  JsonSerial::JsonNode location = jSerial.createStringNode("location", locationValue, false, 0, NULL);
  JsonSerial::JsonNode action = jSerial.createStringNode("action", "turn", false, 0, NULL);
  JsonSerial::JsonNode data_steps = jSerial.createFloatNode("steps", steps, false, 0, NULL);
  JsonSerial::JsonNode data_rotations = jSerial.createFloatNode("turns", rotations, false, 0, NULL);
  JsonSerial::JsonNode *data_children[] = { &data_steps, &data_rotations };
  JsonSerial::JsonNode data = jSerial.createStringNode("data", "", true, 2, data_children);

  JsonSerial::JsonNode *list[] = { &component, &location, &action, &data };

  jSerial.sendJson(list, 4);
}

void fetchSerialData() {
  String data = Serial.readString();
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, data);
  rLed.off();
  gLed.off();
  yLed.off();
  if (error) {
    rLed.on();
  } else {
    int command = doc["command"];
    if (command == START_SCAN) gLed.on();
    else if (command == STOP_SCAN) yLed.on();
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
//  Serial.println(e - s);
}
