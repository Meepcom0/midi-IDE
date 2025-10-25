import "./style.css";

enum Mode {
  COMMAND,
  INT_CONSTANT,
}

let mode = Mode.COMMAND;

function eventLoop(key: number): void {
  if (mode === Mode.COMMAND) {
    if (key === 12) {
      mode = Mode.INT_CONSTANT;
    }
  } else if (mode === Mode.INT_CONSTANT) {
    // ...
  }
}
