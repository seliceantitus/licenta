#include "LCD.h"
#include "LED.h"
#include "Motor.h"
#include "Sensor.h"
#include "Switch.h"
#include "Constants.h"
#include "JsonSerial.h"
#include <ArduinoJson.h>
#include<stdio.h> 
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

void setup() {
  Serial.begin(9600);
  analogReference(EXTERNAL);

  screen = LCD(LANDSCAPE);

  gLed.on();

  sensorAxis.enable();
  turntable.enable();
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
  if (Serial.available()) {
    fetchSerialData();
  }
  sensor.measure();
  sendSensorData();
}
