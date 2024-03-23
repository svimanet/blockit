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


export const shapeMovementCompensator = (shape: Shape, propx: number, propy: number): { x: number, y: number } => {
  let x = propx;
  let y = propy;
  switch (shape) {
    case 'O':
      x -= 168;
      y -= 128
      break;
    case 'I':
      x -= 64;
      y -= 198;
      break;
    case 'I2':
      x -= 240;
      y -= 28;
      break;
    case 'T':
      x -= 128;
      y -= 128
      break;
    case 'S':
      x -= 128;
      y -= 128;
      break;
    case 'Z':
      x -= 128;
      y -= 128
      break;
    case 'J':
      x -= 128;
      y -= 150;
      break;
    case 'L':
      x -= 128;
      y -= 150;
      break;
    default:
      break;
  }
  return { x, y };
}

export const colours = {
  red: '#E36868',
  green: '#68E368',
  blue: '#6868E3',
  yellow: '#E3E368',
  purple: '#E368E3',
  orange: '#E3A668',
  cyan: '#68E3E3',
  pink: '#E368A6',
  white: '#FFFFFF',
  aquamarine: '#7FFFD4',
};

export const randomColour = (): string => {
  const colourstrings = Object.values(colours);
  return colourstrings[Math.floor(Math.random() * colourstrings.length)];
}