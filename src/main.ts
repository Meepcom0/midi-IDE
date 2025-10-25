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

enum NodeType {
  PROGRAM,
  BLOCK,
  ADD,
  ASSIGN,
  IF,
  GREATER_THAN,
}

type Node = {
  type: NodeType;
  parent: Node | undefined;
  childIndex: number | undefined; // defined such that this == this.parent[childIndex]
  children: Node[];
};

let mode = Mode.COMMAND;

let currentNode: Node = {
  type: NodeType.PROGRAM,
  parent: undefined,
  childIndex: undefined,
  children: [],
};

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

// function onMIDIMessage(event) {
//   let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
//   for (const character of event.data) {
//     str += `0x${character.toString(16)} `;
//   }
//   console.log(str);
// }

// function startLoggingMIDIInput(midiAccess) {
//   midiAccess.inputs.forEach((entry) => {
//     entry.onmidimessage = onMIDIMessage;
//   });
// }

// async function setupMidi() {
//   await navigator.permissions.query({ name: "midi" });
//   let midiAccess = await navigator.requestMIDIAccess();
// }

// setupMidi();
