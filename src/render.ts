import { Node, NodeType } from './node-funcs.ts'

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

function invertIfMatches(element: HTMLElement, node: Node, current: Node){ 
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
    switch (statement.type) {
      case NodeType.BLANK: {
        return renderBlank(statement);
      }
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
      case NodeType.BLANK: {
        return renderBlank(node);
      }
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

  function renderBlank(node: Node): Element {
    return span("(...)")
  }

  return renderBlock(node.children[0]);
}
