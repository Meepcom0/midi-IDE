import "./style.css";

enum K {
  C2 = 0,
  CC2 = 1,
  D2 = 2,
  DD2 = 3,
  E2 = 4,
  F2 = 5,
  FF2 = 6,
  G2 = 7,
  GG2 = 8,
  A2 = 9,
  AA2 = 10,
  B2 = 11,
  C3 = 12
}


enum Mode {
  TRAVERSE,
  COMMAND,
  EDIT,
}

enum NodeType {
  PROGRAM,
  BLOCK,
  END,
  PRINT,
  ASSIGN,
  ADD,
  IF,
  GREATER_THAN,
}

type Node = {
  type: NodeType;
  parent: Node | undefined;
  index: number | undefined; // defined such that this == this.parent[index]
  children: Node[];
};

let mode = Mode.EDIT;

let currentNode: Node = {
  type: NodeType.PROGRAM,
  parent: undefined,
  index: undefined,
  children: [],
};

function newNode(current: Node, type: NodeType): Node {
  current.children.push({type: type, parent: current, index: current.children.length, children: []})
  return current;
}

function eventLoop(key: number): void {
  switch (key) {
    //change mode
    case K.FF2:
      mode = Mode.TRAVERSE;
      break;
    case K.GG2:
      mode = Mode.COMMAND;
      break;
    case K.AA2:
      mode = Mode.EDIT;
      break;
    default:
      //
      switch (mode) {
        case Mode.TRAVERSE:
          //TODO
          break;
        case Mode.COMMAND:
          //TODO
          break;
        case Mode.EDIT:
          switch(key) {
            case K.G2:
              //assign
              currentNode = newNode(currentNode, NodeType.ASSIGN);
              break;
            case K.F2:
              //add
              currentNode = newNode(currentNode, NodeType.ADD);
              break;
            case K.G2:
              //print
              currentNode = newNode(currentNode, NodeType.PRINT);
              break;
          }
          break;
      }
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
