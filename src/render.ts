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

function div(): Element {
  const element = document.createElement("div");
  return element;
}

function span(content: string): Element {
  const element = document.createElement("span");
  element.innerHTML = content;
  return element;
}

function invertIfMatches(element: HTMLElement, node: Node, current: Node) {
  if (node === current) {
  }
}

export function renderProgram(node: Node, currentNode: Node): Element {
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
    let element: Element;
    switch (statement.type) {
      case NodeType.BLANK: {
        element = renderBlank(statement);
        break;
      }
      case NodeType.IF: {
        element = renderIf(statement);
        break;
      }
      case NodeType.ASSIGN: {
        element = renderAssign(statement);
        break;
      }
      case NodeType.PRINT: {
        element = renderPrint(statement);
        break;
      }
      default:
        throw new Error();
    }
    if (statement === currentNode) {
      (element as HTMLElement).style.filter = "invert(1)";
      (element as HTMLElement).style.backgroundColor = "black";
    }

    return element;
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
    let expression: Element;
    if (NODE_TYPE_OPERATORS_SYMBOLS_MAP.has(node.type)) {
      expression = renderOp(node);
    } else {
      switch (node.type) {
        case NodeType.BLANK: {
          expression = renderBlank(node);
          break;
        }
        case NodeType.INT_CONST: {
          expression = renderIntConst(node);
          break;
        }
        case NodeType.VARIABLE: {
          expression = renderVariable(node);
          break;
        }
        case NodeType.STR_CONST: {
          expression = renderString(node);
          break;
        }
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
    let left = renderExpression(node.children[0]);
    let right = renderExpression(node.children[1]);
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
    return span(`[${(node.data as number[]).join(" ")}]`);
  }

  function renderString(node: Node): Element {
    return span(`[${(node.data as number[]).join(" ")}]`);
  }

  function renderBlank(node: Node): Element {
    return span("(...)");
  }

  return renderBlock(node);
}
