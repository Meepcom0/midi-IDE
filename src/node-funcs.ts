export type Node = {
  type: NodeType;
  parent: Node | undefined;
  index: number; // defined such that this == this.parent[index]
  data: any;
  children: Node[];
};

export enum NodeType {
  BLANK = "BLANK",
  BLOCK = "BLOCK",
  END = "END",
  PRINT = "PRINT",
  ASSIGN = "ASSIGN",
  IF = "IF",
  WHILE = "WHILE",
  FOR = "FOR",
  VARIABLE = "VARIABLE",
  INT_CONST = "INT_CONST",
  STR_CONST = "STR_CONST",
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  EXPONENT = "EXPONENT",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_EQ = "GREATER_THAN_EQ",
  LESS_THAN_EQ = "LESS_THAN_EQ",
  EQUALS = "EQUALS",
}

export const NODE_TYPE_CHILD_COUNT_MAP = new Map([
  [NodeType.BLANK, 0],
  [NodeType.BLOCK, 1],
  [NodeType.END, 1],
  [NodeType.PRINT, 1],
  [NodeType.ASSIGN, 2],
  [NodeType.IF, 3],
  [NodeType.WHILE, 2],
  [NodeType.FOR, 4],
  [NodeType.VARIABLE, 0],
  [NodeType.INT_CONST, 0],
  [NodeType.STR_CONST, 0],
  [NodeType.ADD, 2],
  [NodeType.SUBTRACT, 2],
  [NodeType.MULTIPLY, 2],
  [NodeType.EXPONENT, 2],
  [NodeType.GREATER_THAN, 2],
  [NodeType.LESS_THAN, 2],
  [NodeType.GREATER_THAN_EQ, 2],
  [NodeType.LESS_THAN_EQ, 2],
  [NodeType.EQUALS, 2],
]);

export function fillNode(current: Node, type: NodeType, data?: any) {
  current.type = type;
  current.data = data;
  for (let i = 0; i < NODE_TYPE_CHILD_COUNT_MAP.get(type)!; i++) {
    current.children.push(blankNode(current, i));
  }
}

export function blankNode(parent: Node, index: number): Node {
  return {
    type: NodeType.BLANK,
    data: undefined,
    parent,
    index,
    children: [],
  };
}

export function getNextLeaf(node: Node): Node {
  let n = node;
  while (!(n.index + 1 < n.parent!.children.length)) {
    n = n.parent!;
  }
  let upRight = n.parent!.children[n.index + 1];
  let m = upRight;
  while (m.children.length > 0) {
    m = m.children[0];
  }
  return m;
}

export function getNextBlankLeaf(node: Node): Node {
  let n = node;
  while (n.type === NodeType.BLANK) {
    n = getNextLeaf(n);
  }
  return n;
}
