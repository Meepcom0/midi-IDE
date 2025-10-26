import {
  type Node,
  NODE_TYPE_OPERATORS_SYMBOLS_MAP,
  NodeType,
} from "./node-funcs.ts";

function byteToInt(b: number[]): number {
  let val = 0;
  for (let i = 7; i >= 0; i--) {
    val = val * 2 + b[i];
  }
  return val;
}

let elements: HTMLElement[] = [];
let colors: [number, number, number][] = [];

const randColorFrag = () => {
  return Math.floor(Math.random() * 256);
};

export const draw = () => {
  for (let i = 0; i < elements.length; i++) {
    colors[i][0] += Math.round((Math.random() * 2 - 1) * 2);
    colors[i][1] += Math.round((Math.random() * 2 - 1) * 2);
    colors[i][2] += Math.round((Math.random() * 2 - 1) * 2);
    colors[i][0] = Math.max(0, colors[i][0]);
    colors[i][1] = Math.max(0, colors[i][1]);
    colors[i][2] = Math.max(0, colors[i][2]);
    let r = colors[i][0].toString(16);
    let g = colors[i][1].toString(16);
    let b = colors[i][2].toString(16);
    elements[i].style.backgroundColor = `#${r}${g}${b}`;
  }
  requestAnimationFrame(draw);
};

function div(): Element {
  const element = document.createElement("div");
  elements.push(element);
  colors.push([randColorFrag(), randColorFrag(), randColorFrag()]);
  return element;
}

function span(content: string): Element {
  const element = document.createElement("span");
  element.innerHTML = content;
  elements.push(element);
  colors.push([randColorFrag(), randColorFrag(), randColorFrag()]);
  return element;
}

function invertIfMatches(element: HTMLElement, node: Node, current: Node) {
  if (node === current) {
  }
}

export function renderProgram(node: Node, currentNode: Node): Element {
  function renderBlock(node: Node): Element {
    const blockElement = div();
    for (const statement of node.children) {
      let statementElement = renderThing(statement);
      (statementElement as HTMLDivElement).style.transform =
        "translate(12px, 0px)";
      blockElement.appendChild(statementElement);
    }
    if (node === currentNode) {
      (blockElement as HTMLElement).style.filter = "invert(1)";
      (blockElement as HTMLElement).style.backgroundColor = "black";
    }
    return blockElement;
  }

  function renderThing(thing: Node): Element {
    let element: Element;
    if (NODE_TYPE_OPERATORS_SYMBOLS_MAP.has(thing.type)) {
      element = renderOp(thing);
    } else {
      switch (thing.type) {
        case NodeType.BLANK: {
          element = renderBlank(thing);
          break;
        }
        case NodeType.IF: {
          element = renderIf(thing);
          break;
        }
        case NodeType.WHILE:
          element = renderWhile(thing);
          break;
        case NodeType.FOR:
          element = renderFor(thing);
          break;
        case NodeType.ASSIGN: {
          element = renderAssign(thing);
          break;
        }
        case NodeType.PRINT: {
          element = renderPrint(thing);
          break;
        }
        case NodeType.INT_CONST: {
          element = renderIntConst(thing);
          break;
        }
        case NodeType.VARIABLE: {
          element = renderVariable(thing);
          break;
        }
        case NodeType.STR_CONST: {
          element = renderString(thing);
          break;
        }
        default:
          throw new Error(thing.type);
      }
    }
    if (thing === currentNode) {
      (element as HTMLElement).style.filter = "invert(1)";
      (element as HTMLElement).style.backgroundColor = "black";
    }

    return element;
  }

  function renderPrint(node: Node): Element {
    let element = div();
    let print = span("print ");

    element.appendChild(print);
    element.appendChild(renderThing(node.children[0]));

    return element;
  }

  function renderAssign(node: Node): Element {
    let element = div();
    (element as HTMLDivElement).style.display = "inline-block";
    element.appendChild(renderThing(node.children[0]));
    element.append(span(" = "));
    element.appendChild(renderThing(node.children[1]));
    return element;
  }

  function renderIf(node: Node): Element {
    let element = div();
    let ifHeader = div();

    ifHeader.appendChild(span("if "));
    ifHeader.appendChild(renderThing(node.children[0]) /* condition */);
    element.appendChild(ifHeader);
    element.appendChild(renderBlock(node.children[1]));

    let elseHeader = div();
    elseHeader.appendChild(span("else"));
    element.appendChild(elseHeader);
    element.appendChild(renderBlock(node.children[2]));
    return element;
  }

  function renderWhile(node: Node): Element {
    let element = div();
    let whileHeader = div();

    whileHeader.appendChild(span("while "));
    whileHeader.appendChild(renderThing(node.children[0]) /* condition */);
    element.appendChild(whileHeader);
    element.appendChild(renderBlock(node.children[1]));
    return element;
  }

  function renderFor(node: Node): Element {
    let element = div();
    let forHeader = div();

    forHeader.appendChild(span("for "));
    forHeader.append(renderThing(node.children[0]));
    forHeader.append(span(" ; "));
    forHeader.append(renderThing(node.children[1]));
    forHeader.append(span(" ; "));
    forHeader.append(renderThing(node.children[2]));
    element.appendChild(forHeader);
    element.appendChild(renderBlock(node.children[3]));
    return element;
  }

  function renderExpression(node: Node): Element {
    let expression: Element;
    if (NODE_TYPE_OPERATORS_SYMBOLS_MAP.has(node.type)) {
      expression = renderOp(node);
    } else {
      switch (node.type) {
        default:
          throw new Error();
      }
      if (node === currentNode) {
        (expression as HTMLElement).style.filter = "invert(1)";
        (expression as HTMLElement).style.backgroundColor = "black";
      }
    }
    return expression;
  }

  function renderOp(node: Node): Element {
    let op_symbol = NODE_TYPE_OPERATORS_SYMBOLS_MAP.get(node.type);
    let left = renderThing(node.children[0]);
    let right = renderThing(node.children[1]);
    let element = span("");
    element.appendChild(span("("));
    element.appendChild(left);
    element.appendChild(span(" " + op_symbol + " "));
    element.appendChild(right);
    element.appendChild(span(")"));
    return element;
  }

  function renderIntConst(node: Node): Element {
    return span(
      (node.data as number[]).map((x) => (x === 0 ? "■" : "□")).join("")
    );
  }

  function renderVariable(node: Node): Element {
    let element = span("");
    for (const d of node.data) {
      let s = span("♩") as HTMLSpanElement;
      s.style.transform = `translate(0, ${-(d - 24)}px)`;
      s.style.display = `inline-block`;
      element.appendChild(s);
    }
    return element;
  }

  function renderString(node: Node): Element {
    let element = span("");
    element.appendChild(span('"'));
    for (const d of node.data) {
      let s = span("♩") as HTMLSpanElement;
      s.style.transform = `translate(0, ${-(d - 24)}px)`;
      s.style.display = `inline-block`;
      element.appendChild(s);
    }
    element.appendChild(span('"'));
    return element;
  }

  function renderBlank(node: Node): Element {
    return span("(...)");
  }

  return renderBlock(node);
}
