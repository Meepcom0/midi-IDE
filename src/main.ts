import "./style.css";

enum K {
  C2 = 0,
  CS2 = 1,
  D2 = 2,
  DS2 = 3,
  E2 = 4,
  F2 = 5,
  FS2 = 6,
  G2 = 7,
  GS2 = 8,
  A2 = 9,
  AS2 = 10,
  B2 = 11,
  C3 = 12
}


enum Mode {
  COMMAND,
  INT_CONSTANT,
  OPERATOR,
  KEYWORD
}

let mode = Mode.COMMAND;

function eventLoop(key: number): void {
  switch (mode) {
    case Mode.COMMAND:
      switch (key) {
        case K.D2:
          mode = Mode.KEYWORD;
          break;
        case K.E2:
          mode = Mode.OPERATOR;
          break;
        case K.F2:
          mode = Mode.INT_CONSTANT;
          break;
      }
      break;
    case Mode.INT_CONSTANT:

      break;
    }
}
