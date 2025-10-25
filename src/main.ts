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

const INT_BIT_DICT = [K.C4, K.D4, K.E4, K.F4, K.G4, K.A4, K.B4, K.C5];

enum Mode {
  TRAVERSE,
  COMMAND,
  OPERATOR,
  VAR_INPUT,
  INT_INPUT,
  STR_INPUT,
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
  VARIABLE,
  INT_CONST,
}

type Node = {
  type: NodeType;
  parent: Node | undefined;
  index: number; // defined such that this == this.parent[index]
  data: any;
  children: Node[];
};

let mode = Mode.OPERATOR;

let currentNode: Node = {
  type: NodeType.PROGRAM,
  data: undefined,
  parent: undefined,
  index: 0,
  children: [],
};

let root = currentNode;

function newNode(current: Node, type: NodeType, data?: any): Node {
  let child = {
    type: type,
    data,
    parent: current,
    index: current.children.length,
    children: [],
  };
  current.children.push(child);
  return child;
}

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
      mode = Mode.OPERATOR;
      break;
    case K.CC3:
      mode = Mode.VAR_INPUT;
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
            case K.C4:
            case K.E4:
            case K.G4:
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
            //TODO

            //move right to next leaf
            //move left to next leaf
          }
          break;
        case Mode.COMMAND:
          //TODO

          //save
          //run
          //what else
          switch (key) {
          }
          break;
        case Mode.OPERATOR:
          switch (key) {
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
        case Mode.VAR_INPUT:
          //int or string input
          switch (key) {
            case K.D3:
              mode = Mode.INT_INPUT;
              break;
            case K.C3:
              mode = Mode.STR_INPUT;
              break;
          }
          break;
        case Mode.INT_INPUT:
          let byte = [0, 0, 0, 0, 0, 0, 0, 0];
          if (INT_BIT_DICT.includes(key)) {
            let i = INT_BIT_DICT.indexOf(key);
            byte[i] = 1 - byte[i];
          }
          if (key == K.D3) {
            //let n: Node = newNode(currentNode, NodeType.INT_CONST)
            //n.index = currentNode.children.length
          }
      }
      break;
  }
  renderTheProgram();
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
  function renderBlock(node: Node): Element {
    const blockElement = document.createElement("div");
    for (const statement of node.children) {
      let statementElement = renderStatement(statement);
      (statementElement as HTMLDivElement).style.transform =
        "translate(12px, 0px)";
      blockElement.appendChild(statementElement);
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
    element.append(span(" = "));
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

function renderTheProgram() {
  document.body.innerHTML = "";
  document.body.appendChild(renderProgram(root));
}

async function main() {
  await navigator.permissions.query({ name: "midi" });
  let midiAccess = await navigator.requestMIDIAccess();
  startLoggingMIDIInput(midiAccess);

  currentNode = newNode(currentNode, NodeType.BLOCK);
  currentNode = newNode(currentNode, NodeType.IF);
  currentNode = newNode(currentNode, NodeType.VARIABLE, "x");
  currentNode = currentNode.parent!;
  currentNode = newNode(currentNode, NodeType.BLOCK);
  currentNode = newNode(currentNode, NodeType.ASSIGN);
  currentNode = newNode(currentNode, NodeType.VARIABLE, "x");
  currentNode = currentNode.parent!;
  currentNode = newNode(currentNode, NodeType.VARIABLE, "y");
  currentNode = currentNode.parent!;
  currentNode = currentNode.parent!;
  currentNode = currentNode.parent!;
  currentNode = newNode(currentNode, NodeType.BLOCK);
  currentNode = newNode(currentNode, NodeType.ASSIGN);
  currentNode = newNode(currentNode, NodeType.VARIABLE, "x");
  currentNode = currentNode.parent!;
  currentNode = newNode(currentNode, NodeType.VARIABLE, "y");
  currentNode = root;

  renderTheProgram();

  console.log(currentNode);
}

main();
