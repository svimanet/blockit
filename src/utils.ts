import type { FigureNode, Shape } from "./types";

export const makeShapes = (cellsize: number): Record<Shape, FigureNode[]> => {
  const cz = cellsize;

  const O: FigureNode[] = [
    { x: 0, y: 0 },
    { x: cz, y: cz},
    { x: 0, y: cz },
    { x: cz, y: 0 },
  ];
  const I: FigureNode[] = [
    { x:0, y:0 },
    { x:0, y:cz},
    { x:0, y:cz*2},
    { x:0, y:cz*3}
  ];
  const I2 = [
    {x:0, y:0},
    {x:cz, y:0},
    {x:cz*2, y:0},
    {x:cz*3, y:0},
  ];
  const T = [
    {x:0, y:0},
    {x:cz, y:0},
    {x:cz*2, y:0},
    {x:cz, y:cz},
  ];
  const S = [
    {x:0, y:0},
    {x:0, y:cz},
    {x:cz, y:cz},
    {x:cz, y:cz*2},
  ];
  const Z = [
    {x:0, y:0},
    {x:cz, y:cz},
    {x:cz, y:0},
    {x:cz*2, y:0},
  ];

  // T1-4, L1-4, Z1-4

  return {
    'O': O,
    'I': I,
    'I2': I2,
    'T': T,
    'S': S,
    'Z': Z,
    'J': Z,
    'L': S,
  } as Record<Shape, FigureNode[]>;
};

// https://tetris.wiki/Tetromino

export const randomShape = (): Shape => {
  const shapestrings: Shape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'I2'];
  return shapestrings[Math.floor(Math.random() * shapestrings.length)];
}

export const grid64 = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288];