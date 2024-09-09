import type { FigureNode, Shape } from "./types";

// https://tetris.wiki/Tetromino
// I O T S Z J L
export const I = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 64, y: 0 },
  { x: 96, y: 0 },
];

export const I2 = [
  { x: 0, y: 0 },
  { x: 0, y: 32 },
  { x: 0, y: 64 },
  { x: 0, y: 96 },
];

export const O = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 0, y: 32 },
  { x: 32, y: 32 },
];

export const T = [
  { x: 32, y: 0 },
  { x: 0, y: 32 },
  { x: 32, y: 32 },
  { x: 64, y: 32 },
];

export const S = [
  { x: 32, y: 0 },
  { x: 64, y: 0 },
  { x: 0, y: 32 },
  { x: 32, y: 32 },
];

export const Z = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 32, y: 32 },
  { x: 64, y: 32 },
];

export const J: FigureNode[] = [
  { x: 0, y: 0 },
  { x: 0, y: 32 },
  { x: 32, y: 32 },
  { x: 64, y: 32 },
];

export const L: FigureNode[] = [
  { x: 64, y: 0 },
  { x: 0, y: 32 },
  { x: 32, y: 32 },
  { x: 64, y: 32 },
];

export const shapes: Record<Shape, FigureNode[]> = {I, O, T, S, Z, J, L, I2};

export const randomShape = (): Shape => {
  const shapestrings: Shape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'I2'];
  return shapestrings[Math.floor(Math.random() * shapestrings.length)];
}

export const grid64 = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288];