#ifndef JsonSerial_h
#define JsonSerial_h

class JsonSerial {
  public:
    struct JsonNode {
      char *key;
      char *value;
      float fValue;
      bool isNested;
      int childrenCount;
      JsonNode **children;
    };
    JsonSerial();
    void parseJson();
    void sendJson(JsonNode *data[], int dataSize);
    JsonNode createStringNode(char *key, char *value, bool isNested, int childrenCount, JsonNode **children);
    JsonNode createFloatNode(char *key, float fValue, bool isNested, int childrenCount, JsonNode **children);
  private:
    int calculateJsonSize(JsonNode **data, int dataSize);
};
#endif
