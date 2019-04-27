#include "JSSerial.h"
#include <ArduinoJson.h>

StaticJsonDocument<2048> doc;

JSSerial::JSSerial() {

}

void JSSerial::parseJSON() {

}

void JSSerial::sendJSON() {
  const size_t capacity = 2 * JSON_OBJECT_SIZE(3);
  DynamicJsonDocument doc(capacity);

  doc["component"] = "sensor";
  doc["action"] = "measurement";

  JsonObject data = doc.createNestedObject("data");
  data["adc"] = 0;
  data["voltage"] = 0;
  data["distance"] = 0;

  serializeJson(doc, Serial);
}
