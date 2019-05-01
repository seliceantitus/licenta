#include <string.h>

#include "LCD.h"
#include "LED.h"
#include "Motor.h"
#include "Sensor.h"
#include "Switch.h"
#include "Constants.h"
#include "JsonSerial.h"

typedef struct JsonNode {
  char *key;
  char *value;
  bool isNested;
  int childrenCount;
  struct JSONNode **children;
} JsonNode;

LCD screen;

LED gLed = LED(GLED);
LED yLed = LED(YLED);
LED rLed = LED(RLED);
Switch limSw1 = Switch(LIMSW1);
Switch limSw2 = Switch(LIMSW2);
Sensor sensor = Sensor(IRSENSOR, 5000);
Motor sensorAxis = Motor(23, 31, 33, 35, 37);
Motor turntable = Motor(22, 30, 32, 34, 36);
JsonSerial jSerial = JsonSerial();

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

void loop() {
  JsonSerial::JsonNode component = jSerial.createNode("component", "sensor", false, 0, NULL);
  JsonSerial::JsonNode action = jSerial.createNode("action", "measurement", false, 0, NULL);

  JsonSerial::JsonNode data_adc = jSerial.createNode("adc", "0", false, 0, NULL);
  JsonSerial::JsonNode data_voltage = jSerial.createNode("voltage", "1", false, 0, NULL);
  JsonSerial::JsonNode data_distance = jSerial.createNode("distance", "2", false, 0, NULL);
  JsonSerial::JsonNode *data_children[] = { &data_adc, &data_voltage, &data_distance };
  JsonSerial::JsonNode data = jSerial.createNode("data", "", true, 3, data_children);

  JsonSerial::JsonNode *list[] = { &component, &action, &data };

  jSerial.sendJson(list, 3);
  delay(400);
}
