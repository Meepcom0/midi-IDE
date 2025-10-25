import "./style.css";

enum Mode {
  COMMAND,
  INT_CONSTANT,
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
  if (mode === Mode.COMMAND) {
    if (key === 12) {
      mode = Mode.INT_CONSTANT;
    }
  } else if (mode === Mode.INT_CONSTANT) {
    // ...
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
