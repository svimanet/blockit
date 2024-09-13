import type { FigureNode, Shape } from "./types";

export const makeShapes = (cellsize: number): Record<Shape, FigureNode[]> => {
  const cz = cellsize;

  const O: FigureNode[] = [
    { x: 0, y: 0 },
    { x: cz, y: cz},
    { x: 0, y: cz },
    { x: cz, y: 0 },
  ];

  return {
    'O': O,
    'I': O,
    'I2': O,
    'T': O,
    'S': O,
    'Z': O,
    'J': O,
    'L': O,
  } as Record<Shape, FigureNode[]>;
};

// https://tetris.wiki/Tetromino

export const randomShape = (): Shape => {
  const shapestrings: Shape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'I2'];
  return shapestrings[Math.floor(Math.random() * shapestrings.length)];
}

export const grid64 = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288];