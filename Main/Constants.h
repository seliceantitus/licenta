enum Colors {
  BLACK       = 0x0000,
  NAVY        = 0x000F,
  DARKGREEN   = 0x03E0,
  DARKCYAN    = 0x03EF,
  MAROON      = 0x7800,
  PURPLE      = 0x780F,
  OLIVE       = 0x7BE0,
  LIGHTGREY   = 0xC618,
  DARKGREY    = 0x7BEF,
  BLUE        = 0x001F,
  GREEN       = 0x07E0,
  CYAN        = 0x07FF,
  RED         = 0xF800,
  MAGENTA     = 0xF81F,
  YELLOW      = 0xFFE0,
  WHITE       = 0xFFFF,
  ORANGE      = 0xFDA0,
  GREENYELLOW = 0xB7E0
};

enum Orientation {
  LANDSCAPE = 1,
  PORTRAIT  = 0
};

enum Buttons {
  START_BUTTON  = 0,
  CANCEL_BUTTON = 1
};

enum Direction {
  HORIZONTAL  = 0,
  VERTICAL    = 1
};

enum SpinDirection {
  RIGHT = LOW,
  LEFT = HIGH
};

enum Shield {
  GLED = 38,
  YLED = 40,
  RLED = 42,
  BTN = 43,
  LIMSW1 = 39,
  LIMSW2 = 41,
  IRSENSOR = A5
};
