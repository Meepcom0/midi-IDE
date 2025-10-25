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
  C3 = 12,
  CC3 = 13,
  D3 = 14,
  DD3 = 15,
  E3 = 16,
  F3 = 17,
  FF3 = 18,
  G3 = 19,
  GG3 = 20,
  A3 = 21,
  AA3 = 22,
  B3 = 23,
  C4 = 24,
  CC4 = 25,
  D4 = 26,
  DD4 = 27,
  E4 = 28,
  F4 = 29,
  FF4 = 30,
  G4 = 31,
  GG4 = 32,
  A4 = 33,
  AA4 = 34,
  B4 = 35,
  C5 = 36,
}

function byteToInt(b: number[]): number {
  let val = 0
  for (let i = 7; i >= 0; i--) {
    val = val*2+b[i]
  }
  return val
}

enum Mode {
  TRAVERSE,
  COMMAND,
  CONTROL_FLOW,
  EXPRESSION,
  VAR_INPUT,
  INT_INPUT,
  STR_INPUT,
}

enum NodeType {
  BLANK,
  PROGRAM,
  BLOCK,
  END,
  PRINT,
  ASSIGN,
  VARIABLE,
  INT_CONST,
  STR_CONST,
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
  EXPONENT,
  IF,
  GREATER_THAN,
  LESS_THAN,
  GREATER_THAN_EQ,
  LESS_THAN_EQ,
  EQUALS,
}

type Node = {
  type: NodeType;
  parent: Node | undefined;
  index: number; // defined such that this == this.parent[index]
  data: any;
  children: Node[];
};

let mode = Mode.CONTROL_FLOW;

let currentNode: Node = {
  type: NodeType.PROGRAM,
  data: undefined,
  parent: undefined,
  index: 0,
  children: [],
};

function newNode(current: Node, type: NodeType, data?: any): Node {
  current.children.push({
    type,
    data,
    parent: current,
    index: current.children.length,
    children: [],
  });
  return current;
}

function blankNode(parent: Node, index: number): Node {
  return {
    type: NodeType.BLANK,
    data: undefined,
    parent,
    index,
    children: [],
  }
}

const BYTE_INT_MAP = new Map([[K.C4, 0], [K.D4, 1], [K.E4, 2], [K.F4, 3], [K.G4, 4], [K.A4, 5], [K.B4, 6], [K.C5, 7]]);
const KEY_EXPRESSION_MAP = new Map([[K.C3, NodeType.ADD], [K.CC3, NodeType.SUBTRACT], [K.D3, NodeType.MULTIPLY], [K.DD3, NodeType.DIVIDE], [K.E3, NodeType.EXPONENT],[K.F3, NodeType.GREATER_THAN],[K.FF3, NodeType.LESS_THAN],[K.G3, NodeType.GREATER_THAN_EQ], [K.GG3, NodeType.LESS_THAN_EQ], [K.A3, NodeType.EQUALS]]);

//K.B3, NodeType.PRINT
//[K.G2, NodeType.ASSIGN]
//IF
//WHILE
//FOR ?
let byte: number[]
let var_name: K[]

function eventLoop(key: K): void {
  switch (key) {
    //change mode
    case K.FF2:
      mode = Mode.TRAVERSE;
      break;
    case K.GG2:
      mode = Mode.COMMAND;
      break;
    case K.AA2:
      mode = Mode.CONTROL_FLOW;
      break;
    default:
      switch (mode) {
        case Mode.TRAVERSE:
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
            //move to right sibling
            case K.E4:
            case K.G4:
            case K.A4:
              if (
                currentNode.parent !== undefined &&
                currentNode.index !== currentNode.parent!.children.length - 1
              ) {
                currentNode =
                  currentNode.parent!.children[currentNode.index! + 1];
              }
              break;
            //move to left sibling
            case K.E3:
            case K.G3:
            case K.A3:
              if (currentNode.parent !== undefined && currentNode.index !== 0) {
                currentNode =
                  currentNode.parent!.children[currentNode.index! - 1];
              }
              break;
            //move right to next leaf
            //case :
            //move left to next leaf
          }
          break;
        case Mode.COMMAND:
          //TODO
          switch (key) {
            case K.F2:
              save()
              break;
            case K.G2:
              run()
              break;
          }
          break;
        case Mode.CONTROL_FLOW:
          //reserve C4-G4
          switch(key) {
            case K.C4:
              //assign
              mode = Mode.VAR_INPUT
              break;
            case K.D4:
              //if
              break;
            case K.E4:
              //while
              break;
            case K.F4:
              //for
              break;
            case K.G4:
              //print
              break;
          }
        case Mode.EXPRESSION:
          if (KEY_EXPRESSION_MAP.has(key)) {
            //add operator node B2-E3 + B3 reserved
            currentNode = newNode(currentNode, KEY_OP_MAP.get(key)!)
          } else {
            //switch to input const or var name mode
            switch (key) {
              case K.G2:
                var_name = []
                mode = Mode.VAR_INPUT
                break;
              case K.A2:
                mode = Mode.STR_INPUT
                break;
              case K.B2:
                byte = [0, 0, 0, 0, 0, 0, 0, 0];
                mode = Mode.INT_INPUT
                break;
            }
          }
          break;
        case Mode.VAR_INPUT:
          //enter var name
          if (key === K.G2) {
            //add var name to tree
            let n: Node = newNode(currentNode, NodeType.VARIABLE)
            n.index = currentNode.children.length
            n.data = var_name
            mode = Mode.OPERATOR
          } else {
            //add note to name
            var_name.push(key)
          }
          break;
        case Mode.INT_INPUT:
          if (BYTE_INT_MAP.has(key)) {
            //toggle bit
            let i = BYTE_INT_MAP.get(key)!;
            byte[i] = 1 - byte[i];
          }
          if (key === K.B2) {
            //add in const int
            let n: Node = newNode(currentNode, NodeType.INT_CONST)
            n.index = currentNode.children.length
            n.data = byteToInt(byte)
            mode = Mode.OPERATOR
          }
        case Mode.STR_INPUT:
          if (key === K.A2) {
            //TODO
            mode = Mode.OPERATOR
          }
      }
      break;
  }
}

//TODO
function save() {

}

//TODO
function run() {

}

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

async function main() {
  await navigator.permissions.query({ name: "midi" });
  let midiAccess = await navigator.requestMIDIAccess();
  startLoggingMIDIInput(midiAccess);

  let element = renderProgram(currentNode);
  document.body.appendChild(element);
}

main();

function div(): Element {
  const element = document.createElement("div");
  return element;
}

function span(content: string): Element {
  const element = document.createElement("span");
  element.innerHTML = content;
  return element;
}

function renderProgram(node: Node): Element {
  let indentation = 0;

  function renderBlock(node: Node): Element {
    const blockElement = document.createElement("div");
    for (const statement of node.children) {
      blockElement.appendChild(renderStatement(statement));
    }
    return blockElement;
  }

  function renderStatement(statement: Node): Element {
    switch (statement.type) {
      case NodeType.IF: {
        return renderIf(statement);
      }
      case NodeType.ASSIGN: {
        return renderAssign(statement);
      }
      case NodeType.PRINT: {
        return renderPrint(statement);
      }
      default:
        throw new Error();
    }
  }

  function renderPrint(node: Node): Element {
    let element = document.createElement("div");
    let print = document.createElement("span");
    print.innerHTML = "print";

    element.appendChild(print);
    element.appendChild(renderExpression(node));

    return element;
  }

  function renderAssign(node: Node): Element {
    let element = div();
    element.appendChild(renderVariable(node.children[0]));
    element.appendChild(renderExpression(node.children[1]));
    return element;
  }

  function renderIf(node: Node): Element {
    let element = div();

    let ifHeader = div();
    ifHeader.appendChild(span("if "));
    ifHeader.appendChild(renderExpression(node.children[0]) /* condition */);
    element.appendChild(ifHeader);

    element.appendChild(renderBlock(node.children[1]));

    let elseHeader = div();
    elseHeader.appendChild(span("else"));
    element.appendChild(elseHeader);

    element.appendChild(renderBlock(node.children[2]));

    return element;
  }

  function renderExpression(node: Node): Element {
    switch (node.type) {
      case NodeType.ADD: {
        return renderAdd(node);
      }
      case NodeType.INT_CONST: {
        return renderIntConst(node);
      }
      case NodeType.VARIABLE: {
        return renderVariable(node);
      }
      case NodeType.ADD: {
        return renderAdd(node);
      }
      // case NodeType.GREATER_THAN: {
      //   return renderGreaterThan(node);
      // }
      default:
        throw new Error();
    }
  }

  function renderAdd(node: Node): Element {
    let left = renderExpression(node.children[0]);
    let right = renderExpression(node.children[1]);
    let element = span("");
    element.appendChild(left);
    element.appendChild(span(" + "));
    element.appendChild(right);
    return element;
  }

  function renderIntConst(node: Node): Element {
    return span((node.data as number).toString());
  }

  function renderVariable(node: Node): Element {
    return span(node.data as string);
  }

  // function renderGreaterThan(node: Node): Element {}

  return renderBlock(node.children[0]);
}
