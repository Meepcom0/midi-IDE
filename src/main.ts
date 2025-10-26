import "./style.css";
import {
  type Node,
  NodeType,
  blankNode,
  fillNode,
  getNextLeaf,
  getNextBlankLeaf,
  getPrevLeaf,
  NODE_TYPE_STATEMENTS,
} from "./node-funcs.ts";
import { K, KEY_BIT_MAP, EDIT_KEY_NODE_TYPE_MAP } from "./key-consts.ts";
import { draw, renderProgram } from "./render.ts";

enum Mode {
  COMMAND = "COMMAND",
  EDIT = "EDIT",
  VAR_INPUT = "VAR_INPUT",
  INT_INPUT = "INT_INPUT",
  STR_INPUT = "STR_INPUT",
}

let mode = Mode.EDIT;

let root: Node = {
  type: NodeType.BLOCK,
  data: undefined,
  parent: undefined,
  index: 0,
  children: [],
};

let currentNode = blankNode(root, 0);
root.children.push(currentNode);

function eventLoop(key: K): void {
  switch (key) {
    //change mode
    case K.GG2:
      mode = Mode.COMMAND;
      break;
    case K.AA2:
      mode = Mode.EDIT;
      break;
    default:
      switch (mode) {
        case Mode.COMMAND:
          switch (key) {
            //move up tree
            case K.C5:
              if (currentNode.parent !== undefined) {
                currentNode = currentNode.parent!;
              }
              break;
            //move down tree (0th leaf)
            case K.C3:
              if (currentNode.children.length > 0) {
                currentNode = currentNode.children[0];
              }
              break;
            //move to left sibling
            case K.D3:
            case K.E3:
            case K.F3:
              if (currentNode.parent !== undefined && currentNode.index !== 0) {
                currentNode =
                  currentNode.parent!.children[currentNode.index! - 1];
              }
              break;
            //move to right sibling
            case K.D4:
            case K.E4:
            case K.F4:
              if (
                currentNode.parent !== undefined &&
                currentNode.index !== currentNode.parent!.children.length - 1
              ) {
                currentNode =
                  currentNode.parent!.children[currentNode.index! + 1];
              }
              break;
            //move to prev leaf
            case K.G3:
            case K.A3:
            case K.B3:
              currentNode = getPrevLeaf(currentNode);
              break;
            //move to next leaf
            case K.G4:
            case K.A4:
            case K.B4:
              currentNode = getNextLeaf(currentNode);
              break;
            case K.F2:
              save();
              break;
            case K.G2:
              run();
              break;
          }
          break;
        case Mode.EDIT:
          //uses C3-G3 + C4 - A4 for typing operators
          if (EDIT_KEY_NODE_TYPE_MAP.has(key)) {
            let new_type = EDIT_KEY_NODE_TYPE_MAP.get(key);
            if (currentNode.parent!.type === NodeType.BLOCK) {
              if (NODE_TYPE_STATEMENTS.includes(new_type!)) {
                currentNode.parent!.children.push(
                  blankNode(
                    currentNode.parent!,
                    currentNode.parent!.children.length
                  )
                );
                fillNode(currentNode, new_type!);
                currentNode = currentNode.children[0];
              }
            } else {
              fillNode(currentNode, new_type!);
              currentNode = currentNode.children[0];
            }
          } else {
            //switch to input const or var name mode
            switch (key) {
              case K.A3:
                currentNode.type = NodeType.VARIABLE;
                currentNode.data = [];
                mode = Mode.VAR_INPUT;
                break;
              case K.AA3:
                currentNode.type = NodeType.STR_CONST;
                currentNode.data = [];
                mode = Mode.STR_INPUT;
                break;
              case K.B3:
                currentNode.type = NodeType.INT_CONST;
                currentNode.data = [0, 0, 0, 0, 0, 0, 0, 0];
                mode = Mode.INT_INPUT;
                break;
            }
          }
          break;
        case Mode.VAR_INPUT:
          //enter var name
          if (key === K.A3) {
            //finish var name and continue
            mode = Mode.EDIT;
            currentNode = getNextBlankLeaf(currentNode);
          } else {
            //add note to name
            currentNode.data.push(key);
          }
          break;
        case Mode.INT_INPUT:
          if (key === K.B3) {
            //finish const and continue
            mode = Mode.EDIT;
            currentNode = getNextBlankLeaf(currentNode);
          } else if (KEY_BIT_MAP.has(key)) {
            //toggle bit
            let i = KEY_BIT_MAP.get(key)!;
            currentNode.data[i] = 1 - currentNode.data[i];
          }
          break;
        case Mode.STR_INPUT:
          if (key === K.AA3) {
            //finish var name and continue
            mode = Mode.EDIT;
            currentNode = getNextBlankLeaf(currentNode);
          } else {
            //add note to name
            currentNode.data.push(key);
          }
          break;
      }
      break;
  }
  console.log(mode);
  console.log(root);
  console.log(currentNode);
  renderTheProgram();
}

//TODO
function save() {}

//TODO
function run() {}

function onMIDIMessage(event: MIDIMessageEvent) {
  if (event.data!.length === 3 && event.data![0] === 144) {
    let [_code, note, vel] = event.data!;
    let MIN_NOTE = 36;
    note -= MIN_NOTE;
    if (vel > 0) {
      console.log(`press ${note} at ${vel}`);
      eventLoop(note);
    } else {
      console.log(`unpress ${note}`);
    }
  }
}

function startLoggingMIDIInput(midiAccess: MIDIAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

function renderTheProgram() {
  document.body.innerHTML = "";
  document.body.appendChild(renderProgram(root, currentNode));
}

async function main() {
  await navigator.permissions.query({ name: "midi" });
  let midiAccess = await navigator.requestMIDIAccess();
  startLoggingMIDIInput(midiAccess);

  renderTheProgram();

  console.log(currentNode);

  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      draw();
    }
  });
}

main();
