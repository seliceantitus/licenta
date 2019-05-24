#include "JsonSerial.h"

#include <Arduino.h>
#include <ArduinoJson.h>

JsonSerial::JsonSerial() {}

void JsonSerial::parseJson(int command) {

}

void recursiveSubNode(JsonObject *parent, JsonSerial::JsonNode node) {
  JsonObject subNest = parent->createNestedObject(node.key);
  for (int i = 0; i < node.childrenCount; i++) {
    if ((node.children[i])->isNested) {
      recursiveSubNode(&subNest, *node.children[i]);
    } else {
      if (node.children[i]->value == NULL) subNest[(node.children[i])->key] = (node.children[i])->fValue;
      else if (node.children[i]->iValue == NULL) subNest[(node.children[i])->key] = (node.children[i])->value;
      else subNest[(node.children[i])->key] = (node.children[i])->iValue;
    }
  }
}

void createSubNode(StaticJsonDocument<1024> *document, JsonSerial::JsonNode *parent) {
  JsonObject nest = document->createNestedObject(parent->key);
  for (int j = 0; j < parent->childrenCount; j++) {
    if ((parent->children[j])->isNested) {
      recursiveSubNode(&nest, *parent->children[j]);
    } else {
      if (parent->children[j]->value == NULL) nest[(parent->children[j])->key] = (parent->children[j])->fValue;
      else  if (parent->children[j]->iValue == NULL) nest[(parent->children[j])->key] = (parent->children[j])->value;
      else nest[(parent->children[j])->key] = (parent->children[j])->iValue;
    }
  }
}

void JsonSerial::sendJson(JsonSerial::JsonNode *data[], int dataSize) {
  StaticJsonDocument<1024> document;

  for (int i = 0; i < dataSize; i++) {
    JsonSerial::JsonNode *node = data[i];
    if (node->isNested) {
      createSubNode(&document, node);
    } else {
      if (node->value == NULL) {
        if (node->iValue == NULL) {
          document[node->key] = node->fValue;
        } else {
          document[node->key] = node->iValue;
        }
      } else {
        document[node->key] = node->value;
      }
    }
  }

  char toSendChar[2048];
  serializeJson(document, toSendChar);
  document.clear();
  Serial.println(toSendChar);
}

JsonSerial::JsonNode JsonSerial::createStringNode(char *key, char *value, bool isNested, int childrenCount, JsonNode **children) {
  JsonSerial::JsonNode node = {key, value, NULL, NULL, isNested, childrenCount, children};
  return node;
}

JsonSerial::JsonNode JsonSerial::createFloatNode(char *key, float fValue, bool isNested, int childrenCount, JsonNode **children) {
  JsonSerial::JsonNode node = {key, NULL, fValue, NULL, isNested, childrenCount, children};
  return node;
}

JsonSerial::JsonNode JsonSerial::createIntNode(char *key, int iValue, bool isNested, int childrenCount, JsonNode **children) {
  JsonSerial::JsonNode node = {key, NULL, NULL, iValue, isNested, childrenCount, children};
  return node;
}

int JsonSerial::calculateJsonSize(JsonSerial::JsonNode **data, int dataSize) {
  int s = JSON_OBJECT_SIZE(dataSize);
  for (int i = 0; i < dataSize; i++) {
    if (data[i]->isNested) {
      s += calculateJsonSize(data[i]->children, data[i]->childrenCount);
    }
  }
  return s;
}
